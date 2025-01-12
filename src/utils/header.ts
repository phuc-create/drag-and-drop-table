export const headerResolver =
  <T extends Record<string, string>>(headers: T) =>
    (title: {
      key: keyof typeof headers
      node: string
    }): { key: string; node: string } => {
      const { key } = title
      const resolvedNode = headers[key] ?? key
      return { key: key as string, node: resolvedNode }
    }
