import { IGalleryImages } from "./IGalleryImages";

export interface IDynamicImagesGalleryState {
    images: IGalleryImages[];
    isLoading: Boolean;
    windowSize: number;
}