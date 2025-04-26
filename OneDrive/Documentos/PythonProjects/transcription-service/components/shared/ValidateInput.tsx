import React, { useState } from "react";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  Path,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ValidateInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: keyof TFieldValues;
  label?: string;
  placeholder: string;
  rules?: RegisterOptions;
  type?: string;
  className?: string;
  required?: boolean;
}

const ValidateInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  type,
  className,
  required,
}: ValidateInputProps<TFieldValues>) => {
  return (
    <div>
      {label && (
        <Label htmlFor={name as string}>
          {label} <span className="text-red-500">{required && "*"}</span>
        </Label>
      )}
      <Controller
        name={name as Path<TFieldValues>}
        control={control}
        rules={rules as any}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            <Input
              {...field}
              id={name as string}
              type={type}
              placeholder={placeholder}
              className={className}
            />
            {error && (
              <p className="text-red-500 font-medium mt-2 text-sm">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ValidateInput;
