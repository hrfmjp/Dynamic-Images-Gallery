import { sp } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IList } from './IList';

export interface IDynamicImagesGalleryService {
    getGalleryImages: (ListId: string, rowLimit: number) => Promise<any[]>;
    getSiteGalleryLibrary: () => Promise<any[]>;
}

export class DynamicImagesGalleryService implements IDynamicImagesGalleryService {
    constructor(context: WebPartContext) {
        sp.setup({
            spfxContext: context
        });
    }
    public async getGalleryImages(ListId: string, rowLimit: number): Promise<any[]> {
        let results: any[] = [];
        console.log('getGalleryImages');
        results = await sp.web
            .lists
            .getById(ListId)
            .items
            .select('File_x0020_Type')
            .top(rowLimit)
            .expand('File')
            .filter((`File_x0020_Type eq 'jpg' or File_x0020_Type eq 'png' or File_x0020_Type eq 'jpeg' or File_x0020_Type eq 'gif'`))
            .orderBy('Modified', false)
            .usingCaching()
            .get();
        return results;
    }

    public async getSiteGalleryLibrary(): Promise<any[]> {
        let results: IList[];
        console.log('getSiteGalleryLibrary');
        results = await sp.web
            .lists
            .select('ID', 'Title', 'Hidden')
            .filter('BaseTemplate eq 101 and Hidden eq false')
            .usingCaching()
            .get();
        console.log('getSiteGalleryLibrary');
        console.log(results);
        return results;
    }
}