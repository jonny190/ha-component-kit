import { useEffect, useMemo, useState, useCallback } from "react";
import { isEqual, omit } from "lodash";
import type { HassEntityCustom } from "@typings";
import type { HassEntity } from "home-assistant-js-websocket";
import { useHass, timeAgo } from "@hooks";
import { useDebouncedCallback } from "use-debounce";
import { getCssColorValue } from "@utils/colors";

export function useEntity(entity: string, throttle = 150) {
  const { getEntity } = useHass();
  const timeSensor = getEntity("sensor.time");
  const matchedEntity = getEntity(entity);

  const formatEntity = useCallback((entity: HassEntity): HassEntityCustom => {
    const relativeTime = timeAgo.format(new Date(entity.last_updated));
    const active = relativeTime === "just now";
    const { hexColor, rgbColor, brightness, rgbaColor } =
      getCssColorValue(entity);
    return {
      ...entity,
      custom: {
        relativeTime,
        active,
        hexColor,
        rgbColor,
        brightness,
        rgbaColor,
      },
    };
  }, []);
  const debounceUpdate = useDebouncedCallback((entity: HassEntity) => {
    setEntity(formatEntity(entity));
  }, throttle);
  const [$entity, setEntity] = useState<HassEntityCustom>(
    formatEntity(matchedEntity)
  );

  useEffect(() => {
    setEntity((entity) => formatEntity(entity));
  }, [formatEntity, timeSensor]);

  useEffect(() => {
    const foundEntity = getEntity(entity);
    if (
      foundEntity &&
      !isEqual(
        omit(foundEntity, "custom", "last_changed", "last_updated"),
        omit($entity, "custom", "last_changed", "last_updated")
      )
    ) {
      debounceUpdate(foundEntity);
    }
  }, [$entity, matchedEntity, debounceUpdate, entity, getEntity]);

  return useMemo(() => $entity, [$entity]);
}
