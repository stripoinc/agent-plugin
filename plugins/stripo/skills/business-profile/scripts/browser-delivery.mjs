const clipped = (value, limit) => {
  const original = String(value || '');
  return {
    text : original.length <= limit ? original
                                    : `${original.slice(0, limit - 1)}…`,
    totalChars : original.length,
    omittedChars : Math.max(0, original.length - limit)
  };
};
export function displayedContext(context) {
  const links = context.links.slice(0, 20),
        images = context.images.slice(0, 12);
  return {
    tag : context.tag,
    text : clipped(context.text, 2000),
    enclosingText : clipped(context.enclosingText, 2000),
    enclosingTag : context.enclosingTag,
    links : {
      shown : links.length,
      total : context.links.length,
      omitted : context.links.length - links.length,
      items : links.map(x => ({...x, text : clipped(x.text, 240)}))
    },
    images,
    imageCoverage : {
      shown : images.length,
      total : context.images.length,
      omitted : context.images.length - images.length
    }
  };
}
const CAPTURE_TREATMENT_FIELDS = [
  'fontFamily', 'fontSize', 'fontSizePx', 'fontWeight', 'fontWeightNumber',
  'fontStyle', 'lineHeight', 'lineHeightPx', 'letterSpacing', 'letterSpacingPx',
  'textTransform', 'textAlign', 'textDecorationLine', 'color',
  'backgroundColor', 'backgroundImage', 'opacity', 'visibility'
];
function treatmentTuple(source, fields) {
  return Object.fromEntries(
      fields.map(field => [field, source?.[field] ?? null]));
}
function treatmentKey(tuple, painted) {
  return JSON.stringify([ painted, ...Object.values(tuple) ]);
}
function sourceExample(owner) {
  return {
    ownerId : owner.ownerId ?? null,
    styleId : owner.styleId ?? null,
    tag : owner.tag ?? null,
    box : owner.box ?? null,
    text : clipped(owner.text, 240)
  };
}
function sourceExamples(owners, limit) {
  if (owners.length <= limit)
    return owners.map(sourceExample);
  const indices = new Set();
  for (let slot = 0; slot < limit; slot += 1)
    indices.add(limit === 1
                    ? Math.floor((owners.length - 1) / 2)
                    : Math.floor(slot * (owners.length - 1) / (limit - 1)));
  return [...indices ].map(index => sourceExample(owners[index]));
}
function boundedTreatmentGroups(groups, maxTreatments = 48, maxExamples = 2) {
  const chosen = new Map(),
        cursors = new Map(groups.map(group => [group.id, 0]));
  let shown = 0, advanced = true;
  while (shown < maxTreatments && advanced) {
    advanced = false;
    for (const group of groups) {
      const cursor = cursors.get(group.id),
            treatment = group.treatments[cursor];
      if (!treatment)
        continue;
      advanced = true;
      cursors.set(group.id, cursor + 1);
      if (shown++ < maxTreatments) {
        if (!chosen.has(group.id))
          chosen.set(group.id, new Set());
        chosen.get(group.id).add(treatment.id);
      }
      if (shown >= maxTreatments)
        break;
    }
  }
  let distinctTotal = 0, shownTotal = 0;
  const items = groups.map(group => {
    const picked = chosen.get(group.id) || new Set(),
          treatments =
              group.treatments.filter(treatment => picked.has(treatment.id))
                  .map(treatment => {
                    const examples =
                        sourceExamples(treatment.owners, maxExamples);
                    return {
                      id : treatment.id,
                      ownerCount : treatment.owners.length,
                      painted : treatment.painted,
                      tuple : treatment.tuple,
                      examples : {
                        shown : examples.length,
                        total : treatment.owners.length,
                        omitted : treatment.owners.length - examples.length,
                        items : examples
                      }
                    };
                  });
    distinctTotal += group.treatments.length;
    shownTotal += treatments.length;
    return {
      ...group.context,
      owners : {
        eligible : group.ownerCount,
        excludedNotRendered : group.excludedNotRendered
      },
      treatments : {
        shown : treatments.length,
        total : group.treatments.length,
        omitted : group.treatments.length - treatments.length,
        items : treatments
      }
    };
  });
  return {
    limit : maxTreatments,
    shown : shownTotal,
    total : distinctTotal,
    omitted : distinctTotal - shownTotal,
    groups : items
  };
}
function buildTypographyProjection(capture, maxTreatments = 48) {
  const styles = new Map(capture.styles.map(style => [style.styleId, style]));
  let treatmentId = 0;
  const groups = capture.groups.map(group => {
    const allOwners = capture.textOwners.filter(owner => owner.groupId ===
                                                         group.landmarkId),
          owners = allOwners.filter(owner => owner.rendered), byKey = new Map();
    for (const owner of owners) {
      const style = styles.get(owner.styleId) || {},
            tuple = treatmentTuple({...style, ...(style.parsed || {})},
                                   CAPTURE_TREATMENT_FIELDS),
            key = treatmentKey(tuple, Boolean(owner.painted));
      if (!byKey.has(key))
        byKey.set(key, {
          id : `t${++treatmentId}`,
          painted : Boolean(owner.painted),
          tuple,
          owners : []
        });
      byKey.get(key).owners.push(owner);
    }
    return {
      id : group.landmarkId,
      context : {
        id : group.landmarkId,
        tag : group.tag,
        role : group.role || null,
        parentLandmarkId : group.parentLandmarkId || null,
        coverage : group.coverage || null
      },
      ownerCount : owners.length,
      excludedNotRendered : allOwners.length - owners.length,
      treatments : [...byKey.values() ]
    };
  });
  const bounded = boundedTreatmentGroups(groups, maxTreatments);
  return {
    label : 'distinct rendered text and paint treatments',
    source :
        'One page capture only. Exact presentation fields are grouped without geometry; capture-local owner IDs are source examples, not actionable native refs. The complete styles and owners remain in captureFile.',
    identityScope : capture.identityScope,
    groupingFields : [ 'painted', ...CAPTURE_TREATMENT_FIELDS ],
    owners : {
      captured : capture.textOwners.length,
      eligibleRendered :
          capture.textOwners.filter(owner => owner.rendered).length,
      excludedNotRendered :
          capture.textOwners.filter(owner => !owner.rendered).length
    },
    treatments : {
      limit : bounded.limit,
      shown : bounded.shown,
      total : bounded.total,
      omitted : bounded.omitted
    },
    groups : bounded.groups
  };
}
export function compactDisplayedTuples(projection) {
  const displayed = projection.groups.flatMap(group => group.treatments.items);
  if (displayed.length < 2)
    return projection;
  const commonFields = Object.keys(displayed[0].tuple).filter(field =>
      displayed.every(treatment =>
                          Object.is(treatment.tuple[field],
                                    displayed[0].tuple[field])));
  if (!commonFields.length)
    return projection;
  const commonTupleFields = Object.fromEntries(
      commonFields.map(field => [field, displayed[0].tuple[field]]));
  return {
    ...projection,
    source :
        'One page capture only. Exact presentation fields are grouped without geometry. Expand each displayed tuple with {...commonTupleFields, ...treatment.tuple}; shared values are equal across every displayed treatment, including literal null. Capture-local owner IDs are source examples, not actionable native refs. Complete styles and owners remain in captureFile.',
    commonTupleFields,
    groups : projection.groups.map(group => ({
      ...group,
      treatments : {
        ...group.treatments,
        items : group.treatments.items.map(treatment => ({
          ...treatment,
          tuple : Object.fromEntries(Object.entries(treatment.tuple).filter(
              ([field ]) => !Object.hasOwn(commonTupleFields, field)))
        }))
      }
    }))
  };
}
const snapshotSegments = value =>
    String(value ?? '').match(/[^\n]*\n|[^\n]+$/gu) || [];
function quotedSnapshotName(line) {
  const match = String(line).match(/"((?:\\.|[^"\\])*)"/u);
  if (!match)
    return null;
  try {
    return JSON.parse(`"${match[1]}"`);
  } catch {
    return null;
  }
}
function compactDuplicateSnapshotText(snapshotText) {
  const source = snapshotSegments(snapshotText), kept = [], stack = [];
  let omittedLines = 0, omittedBytes = 0;
  for (let index = 0; index < source.length; index += 1) {
    const segment = source[index];
    const line = segment.endsWith('\n') ? segment.slice(0, -1) : segment,
          indent = line.match(/^ */u)?.[0].length || 0,
          name = quotedSnapshotName(line);
    while (stack.length && stack.at(-1).indent >= indent)
      stack.pop();
    let nextLine = '';
    for (let cursor = index + 1; cursor < source.length; cursor += 1) {
      nextLine = source[cursor].replace(/\n$/u, '');
      if (nextLine.trim())
        break;
    }
    const nextIndent = nextLine ? nextLine.match(/^ */u)?.[0].length ?? -1 : -1;
    const exactLeaf =
        /^\s*uid=\S+\s+StaticText\s+"(?:\\.|[^"\\])*"\s*$/u.test(line) &&
        nextIndent <= indent;
    const duplicate = exactLeaf && name !== null &&
                      stack.some(ancestor => ancestor.name === name);
    if (duplicate) {
      omittedLines += 1;
      omittedBytes += Buffer.byteLength(segment);
    } else
      kept.push(segment);
    stack.push({indent, name});
  }
  return {
    text : kept.join(''),
    sourceLines : source.length,
    sourceBytes : Buffer.byteLength(String(snapshotText ?? '')),
    omittedLines,
    omittedBytes
  };
}
function scopeSnapshot(snapshotText, maxBytes, deduplicated = {
  omittedLines : 0,
  omittedBytes : 0,
  sourceLines : snapshotSegments(snapshotText).length,
  sourceBytes : Buffer.byteLength(String(snapshotText ?? ''))
}) {
  const text = String(snapshotText ?? ''), segments = snapshotSegments(text),
        textBytes = Buffer.byteLength(text);
  if (textBytes <= maxBytes)
    return {
      text,
      summary : {
        mode : deduplicated.omittedLines
                   ? 'exact-duplicate-static-text-leaves-removed'
                   : 'complete',
        sourceLines : deduplicated.sourceLines,
        sourceBytes : deduplicated.sourceBytes,
        inlineSourceLines : segments.length,
        inlineBytes : textBytes,
        deduplicatedStaticTextLines : deduplicated.omittedLines,
        deduplicatedStaticTextBytes : deduplicated.omittedBytes,
        windowOmittedLines : 0,
        windowOmittedBytes : 0,
        boundaryContextComplete : true,
        complete : deduplicated.omittedLines === 0
      }
    };
  const markerReserve = 520,
        payloadBudget = Math.max(0, maxBytes - markerReserve),
        headBudget = Math.floor(payloadBudget * 0.6);
  let headBytes = 0, tailBytes = 0, headCount = 0, tailStart = segments.length;
  while (headCount < segments.length) {
    const size = Buffer.byteLength(segments[headCount]);
    if (headBytes + size > headBudget)
      break;
    headBytes += size;
    headCount += 1;
  }
  while (tailStart > headCount) {
    const size = Buffer.byteLength(segments[tailStart - 1]);
    if (headBytes + tailBytes + size > payloadBudget)
      break;
    tailStart -= 1;
    tailBytes += size;
  }
  const render = () => {
    const omitted = segments.slice(headCount, tailStart),
          omittedBytes = Buffer.byteLength(omitted.join(''));
    const marker = `\n[inline native snapshot excerpt: ${
        omitted.length} complete source lines / ${
        omittedBytes} bytes omitted between deterministic start/end windows; boundary ancestor, descendant, and adjacent qualifier context may be incomplete; complete lines are not complete evidence units; ${
        deduplicated
            .omittedLines} exact duplicate unqualified childless StaticText leaves / ${
        deduplicated
            .omittedBytes} bytes removed; untouched full snapshot: snapshotFile]\n`;
    return {
      value : segments.slice(0, headCount).join('') + marker +
                  segments.slice(tailStart).join(''),
      omittedLines : omitted.length,
      omittedBytes
    };
  };
  let rendered = render();
  while (Buffer.byteLength(rendered.value) > maxBytes &&
         (tailStart < segments.length || headCount > 0)) {
    if (tailBytes > headBytes && tailStart < segments.length) {
      tailBytes -= Buffer.byteLength(segments[tailStart]);
      tailStart += 1;
    } else if (headCount > 0) {
      headCount -= 1;
      headBytes -= Buffer.byteLength(segments[headCount]);
    } else
      break;
    rendered = render();
  }
  return {
    text : rendered.value,
    summary : {
      mode : 'start-end-complete-line-excerpt',
      sourceLines : deduplicated.sourceLines,
      sourceBytes : deduplicated.sourceBytes,
      inlineSourceLines : headCount + (segments.length - tailStart),
      inlineBytes : Buffer.byteLength(rendered.value),
      deduplicatedStaticTextLines : deduplicated.omittedLines,
      deduplicatedStaticTextBytes : deduplicated.omittedBytes,
      windowOmittedLines : rendered.omittedLines,
      windowOmittedBytes : rendered.omittedBytes,
      boundaryContextComplete : false,
      complete : false
    }
  };
}
const OBSERVE_TEXT_PROFILE = {
  name : 'installed-sol-receiver-2026-09-20-conservative-v1',
  combinedSerializedTextBlockByteLimit : 44000,
  minSnapshotExcerptBytes : 8000,
  maxTreatmentUnits : 48
};
function serializedTextBlockBytes(metadataText, snapshotText) {
  return Buffer.byteLength(JSON.stringify([
    {type : 'text', text : metadataText}, {type : 'text', text : snapshotText}
  ]));
}
function renderObserveText(base, projection, snapshot, profile,
                           beforeFormattingShown, formattingApplied) {
  let combinedBytes = 0, metadataText = '';
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const delivery = {
      profile : profile.name,
      budgetScope :
          'Combined serialized metadata and native-snapshot text blocks only; image delivery is a separate unchanged MCP image block.',
      combinedSerializedTextBlockByteLimit :
          profile.combinedSerializedTextBlockByteLimit,
      combinedSerializedTextBlockBytes : combinedBytes,
      withinConfiguredLimit :
          combinedBytes <= profile.combinedSerializedTextBlockByteLimit,
      formattingApplied,
      treatmentProjection : {
        available : projection.treatments.total,
        beforeFormattingShown,
        displayed : projection.treatments.shown,
        formattingOmitted :
            Math.max(0, beforeFormattingShown - projection.treatments.shown),
        totalOmitted : projection.treatments.omitted,
        completeDisplayedUnits : true,
        note : Object.hasOwn(projection, 'commonTupleFields')
                   ? 'Expand each displayed treatment tuple with commonTupleFields to recover every original field; group context, source-linked examples and omission qualifiers are preserved. Omitted units remain complete in captureFile.'
                   : 'Every displayed treatment keeps its complete tuple, group context, source-linked examples and omission qualifiers; omitted units remain complete in captureFile.'
      },
      snapshot : {
        ...snapshot.summary,
        file : base.snapshotFile,
        inlineLabel :
            snapshot.summary.complete
                ? 'complete current native snapshot'
                : 'deliberately scoped current native snapshot excerpt',
        note :
            snapshot.summary.complete
                ? 'The complete current native snapshot is inline and also retained at snapshotFile.'
                : 'The inline excerpt contains complete lines from deterministic start/end windows, but its boundaries can omit ancestor, descendant, or adjacent qualifier context. Complete lines are not complete evidence units. Treat boundary context as incomplete and read snapshotFile only when a concrete omitted ref or context is needed.'
      },
      note :
          'This is a host-owned development receiving profile, not a universal MCP byte limit. Whole presentation units are omitted before downstream token truncation can split tuples or context.'
    };
    metadataText = JSON.stringify({
      ...base, typographyProjection : projection, delivery
    });
    const next = serializedTextBlockBytes(metadataText, snapshot.text);
    if (next === combinedBytes)
      break;
    combinedBytes = next;
  }
  return {
    metadataText,
    snapshotText : snapshot.text,
    combinedBytes : serializedTextBlockBytes(metadataText, snapshot.text),
    projection,
    snapshotSummary : snapshot.summary
  };
}
function compactSelectedObserveText(selected, base, profile,
                                    beforeFormattingShown, formattingApplied) {
  const projection = compactDisplayedTuples(selected.projection);
  if (projection === selected.projection)
    return selected;
  const candidate = renderObserveText(
      base, projection,
      {text : selected.snapshotText, summary : selected.snapshotSummary},
      profile, beforeFormattingShown, formattingApplied);
  return candidate.combinedBytes < selected.combinedBytes &&
                 candidate.combinedBytes <=
                     profile.combinedSerializedTextBlockByteLimit
             ? candidate
             : selected;
}
export function formatObserveText(base, capture, snapshotText,
                                  profile = OBSERVE_TEXT_PROFILE) {
  const fullProjection =
            buildTypographyProjection(capture, profile.maxTreatmentUnits),
        fullSnapshot = scopeSnapshot(snapshotText, Infinity),
        beforeFormattingShown = fullProjection.treatments.shown;
  let rendered = renderObserveText(base, fullProjection, fullSnapshot, profile,
                                   beforeFormattingShown, false);
  if (rendered.combinedBytes <= profile.combinedSerializedTextBlockByteLimit)
    return compactSelectedObserveText(rendered, base, profile,
                                     beforeFormattingShown, false);
  const compacted = compactDuplicateSnapshotText(snapshotText),
        reserve = Math.min(profile.minSnapshotExcerptBytes,
                           Buffer.byteLength(compacted.text));
  let chosen = null, chosenCap = 0;
  for (let cap = profile.maxTreatmentUnits; cap >= 0; cap -= 1) {
    const projection = buildTypographyProjection(capture, cap),
          scoped = scopeSnapshot(compacted.text, reserve, compacted),
          candidate = renderObserveText(base, projection, scoped, profile,
                                        beforeFormattingShown, true);
    if (candidate.combinedBytes <=
        profile.combinedSerializedTextBlockByteLimit) {
      chosen = candidate;
      chosenCap = cap;
      break;
    }
  }
  if (!chosen) {
    const projection = buildTypographyProjection(capture, 0),
          scoped = scopeSnapshot(compacted.text, 512, compacted);
    chosen = renderObserveText(base, projection, scoped, profile,
                               beforeFormattingShown, true);
    chosenCap = 0;
  }
  const compactedBytes = Buffer.byteLength(compacted.text);
  let low = Math.min(reserve, compactedBytes), high = compactedBytes,
      best = chosen;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2),
          projection = buildTypographyProjection(capture, chosenCap),
          scoped = scopeSnapshot(compacted.text, mid, compacted),
          candidate = renderObserveText(base, projection, scoped, profile,
                                        beforeFormattingShown, true);
    if (candidate.combinedBytes <=
        profile.combinedSerializedTextBlockByteLimit) {
      best = candidate;
      low = mid + 1;
    } else
      high = mid - 1;
  }
  if (best.combinedBytes > profile.combinedSerializedTextBlockByteLimit)
    throw Error(
        'Configured observe text profile cannot fit the minimum honest response');
  return compactSelectedObserveText(best, base, profile, beforeFormattingShown,
                                    true);
}
// BEGIN_SHARED_DELIVERY_POLICY_TEST_SEAM
export const DELIVERY_PROFILE = {
  name : 'installed-sol-receiver-2026-09-20-common-v1',
  combinedSerializedTextByteLimit : 44000,
  receiptReserveBytes : 3200,
  smallStructuredInlineBytes : 8000,
  selectiveSnapshotThresholdBytes : 8000,
  selectiveSnapshotPreviewBytes : 6000
};
export function deliverySerializedTextBytes(result) {
  const exposed = {
    content :
        (result?.content || [])
            .filter(block => block?.type === 'text')
            .map(block => ({type : 'text', text : String(block.text ?? '')}))
  };
  if (result?.structuredContent !== undefined)
    exposed.structuredContent = result.structuredContent;
  return Buffer.byteLength(JSON.stringify(exposed));
}
function deliveryOperation(value) {
  if (typeof value === 'string')
    return {name : value, focusRefs : []};
  return {
    name : String(value?.name || 'unknown'),
    focusRefs : [...(value?.focusRefs || []) ].filter(
        ref => typeof ref === 'string' && ref)
  };
}
function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
function snapshotDescriptor(result) {
  const blocks = result?.content || [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block?.type !== 'text')
      continue;
    const parsed = safeJsonParse(block.text);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object' ||
        typeof parsed.snapshotFile !== 'string')
      continue;
    const snapshotIndex = blocks.findIndex((candidate, candidateIndex) =>
                                               candidateIndex !== index &&
                                               candidate?.type === 'text');
    if (snapshotIndex >= 0)
      return {
        metadataIndex : index,
        snapshotIndex,
        file : parsed.snapshotFile,
        metadata : parsed
      };
  }
  return null;
}
function exactStructuredDuplicate(result) {
  if (result?.structuredContent === undefined)
    return false;
  const structured = JSON.stringify(result.structuredContent);
  return (result.content || [])
      .some(block =>
                block?.type === 'text' &&
                (block.text === structured ||
                 JSON.stringify(safeJsonParse(block.text)) === structured));
}
function stateControlSummary(state) {
  if (!state || Array.isArray(state) || typeof state !== 'object')
    return null;
  const summary = {};
  for (const key of ['atomic', 'consistencyChecked', 'hostRequestedMovement',
                     'imageCaptured', 'measuredUrl', 'measurementCapturedAt',
                     'refsCapturedAt', 'imageCompletedAt'])
    if (state[key] !== undefined)
      summary[key] = state[key];
  for (const key of ['started', 'before', 'after'])
    if (state[key] && typeof state[key] === 'object')
      summary[key] = {
        identity : state[key].identity ?? null,
        url : state[key].url ?? null
      };
  return summary;
}
function boundedJsonEnvelope(parsed, maxBytes, fullResultFile) {
  const delivery = {
    complete : false,
    fullResultFile,
    note :
        'Exact fields shown here retain their original names and values. omittedFields are complete only in fullResultFile or the named operation source file; no altered measurement or value shape is presented as full evidence.'
  },
        output = {$delivery : delivery}, omittedFields = [];
  const priorities = [
    'ref', 'file', 'assemblyFile', 'captureFile', 'snapshotFile', 'image',
    'state', 'readiness',
    'viewportCoverage', 'page', 'counts', 'incomplete', 'refScopes', 'status',
    'message', 'error', 'context', 'measurement', 'value'
  ];
  const seen = new Set();
  for (const key of priorities) {
    if (!(key in parsed))
      continue;
    seen.add(key);
    const candidate = {
      ...output,
      [key] : parsed[key],
      omittedFields : [
        ...omittedFields,
        ...Object.keys(parsed).filter(name => !seen.has(name) && name !== key)
      ]
    };
    if (Buffer.byteLength(JSON.stringify(candidate)) <= maxBytes)
      output[key] = parsed[key];
    else if (key === 'state') {
      const stateSummary = stateControlSummary(parsed.state), summarized = {
        ...output,
        stateSummary,
        omittedFields : [...omittedFields, 'state' ]
      };
      if (stateSummary &&
          Buffer.byteLength(JSON.stringify(summarized)) <= maxBytes)
        output.stateSummary = stateSummary;
      omittedFields.push(key);
    } else
      omittedFields.push(key);
  }
  for (const key of Object.keys(parsed))
    if (!seen.has(key))
      omittedFields.push(key);
  output.omittedFields = [...new Set(omittedFields) ];
  return JSON.stringify(output);
}
function boundedTextPreview(value, maxBytes, fullResultFile) {
  const text = String(value ?? '');
  if (Buffer.byteLength(text) <= maxBytes)
    return {text, complete : true};
  const parsed = safeJsonParse(text);
  if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
    const projected = boundedJsonEnvelope(parsed, maxBytes, fullResultFile);
    if (Buffer.byteLength(projected) <= maxBytes)
      return {text : projected, complete : false};
  }
  if (parsed !== null) {
    const marker = JSON.stringify({
      $delivery : {
        complete : false,
        fullResultFile,
        sourceType : Array.isArray(parsed) ? 'array' : typeof parsed,
        sourceItems : Array.isArray(parsed) ? parsed.length : undefined,
        note :
            'The complete JSON value is file-backed; no truncated or shape-mutated JSON is presented inline.'
      }
    });
    if (Buffer.byteLength(marker) <= maxBytes)
      return {text : marker, complete : false};
  }
  const reserve = 420, payload = Math.max(0, maxBytes - reserve),
        head = Math.floor(payload * 0.6), tail = Math.max(0, payload - head),
        sourceBytes = Buffer.byteLength(text);
  const start = Buffer.from(text).subarray(0, head).toString('utf8').replace(
            /\uFFFD+$/u, ''),
        end = Buffer.from(text)
                  .subarray(Math.max(0, sourceBytes - tail))
                  .toString('utf8')
                  .replace(/^\uFFFD+/u, '');
  return {
    text : `[partial text preview; ${
        sourceBytes} source bytes; omitted middle and boundary context may be incomplete; complete original: ${
        fullResultFile}]\n${start}\n[... omitted ...]\n${end}`,
    complete : false
  };
}
function nativeRefPattern(ref) {
  const escaped = ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\s)(?:uid=${escaped}|\\[ref=${escaped}\\])(?=\\s|$)`,
                    'mu');
}
export function focusedSnapshotPreview(snapshotText, maxBytes, sourceFile,
                                       focusRefs = []) {
  const source = snapshotSegments(snapshotText),
        sourceBytes = Buffer.byteLength(String(snapshotText ?? ''));
  if (sourceBytes <= maxBytes) {
    const text = String(snapshotText ?? '');
    return {
      text,
      summary : {
        complete : true,
        sourceFile,
        sourceLines : source.length,
        sourceBytes,
        inlineSourceLines : source.length,
        inlineBytes : sourceBytes,
        focusRefsRequested : focusRefs,
        focusRefsMatched :
            focusRefs.filter(ref => nativeRefPattern(ref).test(text))
      }
    };
  }
  const refLines = new Map(), priority = [];
  for (const ref of focusRefs) {
    const pattern = nativeRefPattern(ref), indices = [];
    for (let index = 0; index < source.length; index += 1)
      if (pattern.test(source[index])) {
        indices.push(index);
        for (let at = Math.max(0, index - 4);
             at <= Math.min(source.length - 1, index + 8); at += 1)
          priority.push(at);
      }
    refLines.set(ref, indices);
  }
  for (let index = 0; index < Math.min(source.length, 32); index += 1)
    priority.push(index);
  for (let index = Math.max(0, source.length - 14); index < source.length;
       index += 1)
    priority.push(index);
  const selected = new Set(), lineBudget = Math.max(0, maxBytes - 1600);
  let used = 0;
  for (const index of priority) {
    if (selected.has(index))
      continue;
    const bytes = Buffer.byteLength(source[index]);
    if (used + bytes > lineBudget)
      continue;
    selected.add(index);
    used += bytes;
  }
  const ordered = [...selected ].sort((a, b) => a - b), parts = [
    `[partial native snapshot navigation view; complete source: ${
        sourceFile}; ${source.length} source lines / ${
        sourceBytes} bytes; included lines are exact but do not form a complete semantic tree or prove omitted qualifiers]\n`
  ];
  let previous = -2;
  for (const index of ordered) {
    if (index > previous + 1)
      parts.push(`[source lines ${previous + 2}-${
          index} omitted; boundary ancestry, descendants, and adjacent qualifiers may be incomplete]\n`);
    parts.push(source[index]);
    previous = index;
  }
  if (previous < source.length - 1)
    parts.push(`[source lines ${previous + 2}-${
        source
            .length} omitted; read the complete source only for a concrete missing ref or context]\n`);
  let rendered = parts.join(''), wholeLineCountKnown = true;
  if (Buffer.byteLength(rendered) > maxBytes) {
    rendered = boundedTextPreview(rendered, maxBytes, sourceFile).text;
    wholeLineCountKnown = false;
  }
  const focusRefsMatched = focusRefs.filter(
      ref => (refLines.get(ref) || []).some(index => selected.has(index)) &&
             nativeRefPattern(ref).test(rendered));
  return {
    text : rendered,
    summary : {
      complete : false,
      sourceFile,
      sourceLines : source.length,
      sourceBytes,
      inlineSourceLines : wholeLineCountKnown ? selected.size : null,
      inlineSourceLineCountKnown : wholeLineCountKnown,
      inlineBytes : Buffer.byteLength(rendered),
      focusRefsRequested : focusRefs,
      focusRefsMatched,
      note :
          wholeLineCountKnown
              ? 'Start/end navigation lines and exact requested-ref neighborhoods are included when they fit. This preview is not a complete subtree or factual support packet.'
              : 'An emergency byte fallback was required after line selection, so the inline whole-line count is unknown and boundary lines may be partial. Use the complete source for exact line context.'
    }
  };
}
function fileOnlySnapshotReference(snapshotText, sourceFile, focusRefs = []) {
  const
      sourceLines = snapshotSegments(snapshotText).length,
      sourceBytes = Buffer.byteLength(String(snapshotText ?? '')),
      text = `[large automatic native snapshot omitted inline so the complete selected result and operation state could remain inline; full current snapshot: ${
          sourceFile}; ${sourceLines} source lines / ${
          sourceBytes} bytes; requested refs: ${
          focusRefs.length
              ? focusRefs.join(', ')
              : 'none'}; file refs are historical until accepted by a later native action]\n`;
  return {
    text,
    summary : {
      complete : false,
      sourceFile,
      sourceLines,
      sourceBytes,
      inlineSourceLines : 0,
      inlineBytes : Buffer.byteLength(text),
      focusRefsRequested : focusRefs,
      focusRefsMatched : [],
      selectedEvidencePrioritized : true,
      note :
          'No snapshot tree lines are inline. The exact selected result and operation state were prioritized; use the full snapshot only for a concrete next ref or omitted context.'
    }
  };
}
export function composeResult(result, operation, retainOverflow,
                              profile = DELIVERY_PROFILE) {
  const op = deliveryOperation(operation), original = result || {content : []};
  let delivered = {...original, content : [...(original.content || []) ]},
      fullResultFile = null, transformed = false;
  const retain = () => {
    if (!fullResultFile) {
      fullResultFile = retainOverflow(original);
      if (typeof fullResultFile !== 'string' || !fullResultFile)
        throw Error(
            'Delivery retention did not return an accessible host-public path');
    }
    return fullResultFile;
  };
  const snapshot = snapshotDescriptor(delivered);
  let snapshotSummary = null;
  const duplicateStructured = exactStructuredDuplicate(original);
  if (original.structuredContent !== undefined) {
    retain();
    delete delivered.structuredContent;
    transformed = true;
    if (!duplicateStructured) {
      const exact =
          JSON.stringify({structuredContent : original.structuredContent});
      delivered.content.push({
        type : 'text',
        text :
            Buffer.byteLength(exact) <= profile.smallStructuredInlineBytes
                ? exact
                : JSON.stringify({
                    structuredContentDelivery : {
                      complete : false,
                      fullResultFile,
                      sourceType : Array.isArray(original.structuredContent)
                                       ? 'array'
                                       : typeof original.structuredContent,
                      note :
                          'Complete nonduplicate structured content is file-backed because the actual client can replace sibling text with this top-level field.'
                    }
                  })
      });
    }
  }
  if (original.isError)
    delivered.content.push({
      type : 'text',
      text :
          'ERROR: browser host operation failed. The preceding text contains the available error detail; no success is implied.'
    });
  if (op.name !== 'observe' && snapshot) {
    const block = delivered.content[snapshot.snapshotIndex],
          bytes = Buffer.byteLength(String(block.text ?? ''));
    if (bytes > profile.selectiveSnapshotThresholdBytes) {
      retain();
      const focusRefs = [...new Set([
        ...op.focusRefs, ...(typeof snapshot.metadata?.ref === 'string'
                                 ? [ snapshot.metadata.ref ]
                                 : [])
      ]) ];
      const preview = focusedSnapshotPreview(
          block.text, profile.selectiveSnapshotPreviewBytes, snapshot.file,
          focusRefs);
      delivered.content[snapshot.snapshotIndex] = {
        ...block,
        text : preview.text
      };
      snapshotSummary = preview.summary;
      transformed = true;
    }
  }
  let combined = deliverySerializedTextBytes(delivered);
  if (combined > profile.combinedSerializedTextByteLimit) {
    retain();
    transformed = true;
  }
  const contentLimit = transformed ? profile.combinedSerializedTextByteLimit -
                                         profile.receiptReserveBytes
                                   : profile.combinedSerializedTextByteLimit;
  if (combined > contentLimit && snapshot && op.name !== 'observe') {
    const block = delivered.content[snapshot.snapshotIndex],
          sourceText = original.content[snapshot.snapshotIndex].text,
          focusRefs = [...new Set([
            ...op.focusRefs, ...(typeof snapshot.metadata?.ref === 'string'
                                     ? [ snapshot.metadata.ref ]
                                     : [])
          ]) ],
          withoutSnapshot = {
            ...delivered,
            content : delivered.content.map((candidate, index) =>
                                                index === snapshot.snapshotIndex
                                                    ? {...candidate, text : ''}
                                                    : candidate)
          };
    let cap = Math.min(Buffer.byteLength(String(block.text ?? '')),
                       Math.max(600, contentLimit - deliverySerializedTextBytes(
                                                        withoutSnapshot)));
    for (let attempt = 0; attempt < 8 && combined > contentLimit;
         attempt += 1) {
      const preview =
          op.name === 'reveal' && cap < 1600
              ? fileOnlySnapshotReference(sourceText, snapshot.file, focusRefs)
              : focusedSnapshotPreview(sourceText, cap, snapshot.file,
                                       focusRefs);
      delivered.content[snapshot.snapshotIndex] = {
        ...block,
        text : preview.text
      };
      snapshotSummary = preview.summary;
      combined = deliverySerializedTextBytes(delivered);
      cap = Math.max(600, cap - (combined - contentLimit) - 256);
    }
    if (combined > contentLimit) {
      const reference =
          fileOnlySnapshotReference(sourceText, snapshot.file, focusRefs);
      delivered.content[snapshot.snapshotIndex] = {
        ...block,
        text : reference.text
      };
      snapshotSummary = reference.summary;
      combined = deliverySerializedTextBytes(delivered);
    }
  }
  if (combined > contentLimit) {
    while (combined > contentLimit) {
      const candidates =
          delivered.content
              .map((block, index) => ({
                     block,
                     index,
                     bytes : block?.type === 'text'
                                 ? Buffer.byteLength(String(block.text ?? ''))
                                 : 0
                   }))
              .filter(item => item.bytes > 600)
              .sort((a, b) => b.bytes - a.bytes);
      const candidate = candidates[0];
      if (!candidate)
        break;
      const excess = combined - contentLimit,
            target = Math.max(600, candidate.bytes - excess - 900),
            preview = boundedTextPreview(candidate.block.text, target,
                                         fullResultFile);
      if (Buffer.byteLength(preview.text) >= candidate.bytes) {
        delivered.content[candidate.index] = {
          ...candidate.block,
          text : JSON.stringify({
            $delivery : {
              complete : false,
              fullResultFile,
              note :
                  'Original text retained; no smaller useful structural projection fit the shared response budget.'
            }
          })
        };
      } else
        delivered.content[candidate.index] = {
          ...candidate.block,
          text : preview.text
        };
      combined = deliverySerializedTextBytes(delivered);
    }
  }
  if (transformed) {
    const receipt = {
      delivery : {
        profile : profile.name,
        operation : op.name,
        fullResultFile,
        combinedSerializedTextByteLimit :
            profile.combinedSerializedTextByteLimit,
        combinedSerializedTextBytes : 0,
        withinConfiguredLimit : false,
        structuredDuplicateOmitted : duplicateStructured,
        ...(snapshotSummary ? {snapshot : snapshotSummary} : {}),
        note :
            'Images are unchanged. The retained envelope and existing source files contain the complete allowed result before presentation scoping; previews are incomplete navigation aids.'
      }
    };
    const receiptBlock = {type : 'text', text : ''};
    delivered.content.push(receiptBlock);
    for (let attempt = 0; attempt < 8; attempt += 1) {
      receipt.delivery.combinedSerializedTextBytes =
          deliverySerializedTextBytes(delivered);
      receipt.delivery.withinConfiguredLimit =
          receipt.delivery.combinedSerializedTextBytes <=
          profile.combinedSerializedTextByteLimit;
      receiptBlock.text = JSON.stringify(receipt);
    }
    if (deliverySerializedTextBytes(delivered) >
        profile.combinedSerializedTextByteLimit)
      throw Error(
          'Shared delivery receipt exceeded its reserved serialized-text space');
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const actual = deliverySerializedTextBytes(delivered);
      if (receipt.delivery.combinedSerializedTextBytes === actual)
        break;
      receipt.delivery.combinedSerializedTextBytes = actual;
      receiptBlock.text = JSON.stringify(receipt);
    }
    receipt.delivery.withinConfiguredLimit = true;
    receiptBlock.text = JSON.stringify(receipt);
  }
  if (deliverySerializedTextBytes(delivered) >
      profile.combinedSerializedTextByteLimit)
    throw Error(
        'Shared delivery policy exceeded its combined serialized text limit');
  return delivered;
}
// END_SHARED_DELIVERY_POLICY_TEST_SEAM
