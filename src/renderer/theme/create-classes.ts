import { themeConfig } from './theme-config';

// ----------------------------------------------------------------------

// eslint-disable-next-line import/prefer-default-export
export function createClasses(className: string): string {
  return `${themeConfig.classesPrefix}__${className}`;
}
