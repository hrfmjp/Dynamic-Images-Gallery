import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  Version,
  DisplayMode
} from '@microsoft/sp-core-library';
import {
  WebPartContext,
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import * as strings from 'DynamicImagesGalleryWebPartStrings';
import DynamicImagesGallery from './components/DynamicImagesGallery';
import { IDynamicImagesGalleryProps } from './components/IDynamicImagesGalleryProps';
import { DynamicImagesGalleryService } from './services/DynamicImagesGalleryServices';

export interface IDynamicImagesGalleryWebPartProps {
  imagesGallery: string;
  maxItems: number;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  context: WebPartContext;
  webPartElem: HTMLElement;
}

export default class DynamicImagesGalleryWebPart extends BaseClientSideWebPart<IDynamicImagesGalleryWebPartProps> {

  private service: DynamicImagesGalleryService = null;
  private lists: IPropertyPaneDropdownOption[] = [];

  public constructor() {
    super();
  }
  public render(): void {
    const element: React.ReactElement<IDynamicImagesGalleryProps> = React.createElement(
      DynamicImagesGallery,
      {
        imagesGallery: this.properties.imagesGallery,
        maxItems: this.properties.maxItems,
        title: this.properties.title,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        context: this.context,
        webPartElem: this.context.domElement
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {
    this.service = new DynamicImagesGalleryService(this.context);
    if (!this.properties.imagesGallery) {
      const _lists = await this.loadLists();
      if (_lists.length > 0) {
        this.lists = _lists;
        this.properties.imagesGallery = this.lists[0].key.toString();
      }
    }
    if (!this.properties.maxItems) {
      this.properties.maxItems = 5;
    }
  }

  private async loadLists(): Promise<IPropertyPaneDropdownOption[]> {
    const _lists: IPropertyPaneDropdownOption[] = [];
    const results = await this.service.getSiteGalleryLibrary();
    for (const list of results) {
      _lists.push({ key: list.Id, text: list.Title });
    }
    return _lists;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async onPropertyPaneConfigurationStart() {
    const _lists = await this.loadLists();
    this.lists = _lists;
    this.context.propertyPane.refresh();
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.WebPartSettingsGroupName,
              groupFields: [
                PropertyPaneDropdown('imagesGallery', {
                  label: strings.ImagesGalleryFieldLabel,
                  options: this.lists,
                  disabled: false
                }),
                PropertyPaneSlider('maxItems', {
                  label: strings.MaxItemsFieldLabel,
                  min: 1,
                  max: 10,
                  step: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}