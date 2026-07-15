"use client";

import { useEffect, useMemo } from "react";
import {
  PatchEvent,
  set,
  type NumberInputProps,
  useFormValue,
} from "sanity";
import { calculateReadingMinutes } from "@/sanity/lib/readingTime";

export function ReadingMinutesInput(props: NumberInputProps) {
  const { onChange, value } = props;
  const body = useFormValue(["body"]);
  const calculatedValue = useMemo(
    () => calculateReadingMinutes(body),
    [body],
  );

  useEffect(() => {
    if (value === calculatedValue) return;
    onChange(PatchEvent.from(set(calculatedValue)));
  }, [calculatedValue, onChange, value]);

  return props.renderDefault({
    ...props,
    value: calculatedValue,
    readOnly: true,
    elementProps: {
      ...props.elementProps,
      readOnly: true,
    },
  });
}
