import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDynamicImagesGalleryProps {
  imagesGallery: string;
  maxItems: number;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  context: WebPartContext;
  webPartElem: HTMLElement;
}
