// import { IDatePickerControl } from "../../../renderer/types/common";

export type ScrapingTemplate = {
  title: string;
  platform: string;
  sort: string;
  category: string;
  endValue: number;
  minPrice: number;
  maxPrice: number;
  freeShipping: boolean;
  anonymousDelivery: boolean;
  errorLimit: number;
};

export type ScrapingTemplateRow = {
  id: string;
  title: string;
  platform: string;
  sort: string;
  category: string;
  endValue: number;
  minPrice: number;
  maxPrice: number;
  freeShipping: boolean;
  anonymousDelivery: boolean;
  errorLimit: number;
  createdAt: string;
};

export type ScrapingTemplateTableFilters = {
  title: string;
  platform: string;
  // service: string[];
  createdAt: string;
};
