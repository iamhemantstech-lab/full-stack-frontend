// src/utils/formData.js

/**
 * Converts ANY JavaScript object (with nested objects, arrays, and files) into FormData
 */
export const objectToFormData = (
  obj,
  formData = new FormData(),
  parentKey = "",
) => {
  if (!obj) return formData;

  // If already FormData, don't re-process
  if (typeof FormData !== "undefined" && obj instanceof FormData) {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    // 1. Skip null or undefined
    if (value === undefined || value === null) {
      return;
    }

    // Compute key path (e.g. "user[address][city]")
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    // 2. Date object -> Convert to ISO string
    if (value instanceof Date) {
      formData.append(formKey, value.toISOString());
    }
    // 3. File or Blob -> Append directly with original name
    else if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value, value.name);
    }
    // 4. Array -> Can be array of files, strings, or objects
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${formKey}[${index}]`;

        if (item instanceof File || item instanceof Blob) {
          formData.append(formKey, item, item.name);
        } else if (typeof item === "object" && item !== null) {
          objectToFormData(item, formData, arrayKey); // Recursive call for array of objects
        } else {
          formData.append(arrayKey, item);
        }
      });
    }
    // 5. Nested Object (e.g. address: { city: '...' })
    else if (typeof value === "object") {
      objectToFormData(value, formData, formKey); // Recursive call for nested object
    }
    // 6. Primitives (String, Number, Boolean)
    else {
      formData.append(formKey, value);
    }
  });

  return formData;
};
