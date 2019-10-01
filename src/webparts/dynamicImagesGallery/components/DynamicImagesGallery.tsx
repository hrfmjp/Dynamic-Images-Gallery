import * as React from 'react';
import {
  Link,
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react';
import styles from './DynamicImagesGallery.module.scss';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';

import { IDynamicImagesGalleryProps } from './IDynamicImagesGalleryProps';
import { IDynamicImagesGalleryState } from './IDynamicImagesGalleryState';
import { IGalleryImages } from './IGalleryImages';
import { DynamicImagesGalleryService } from '../services/DynamicImagesGalleryServices';
import { DynamicImagesGalleryFocusZone } from './DynamicImagesGalleryFocusZone';

export default class DynamicImagesGallery extends React.Component<IDynamicImagesGalleryProps, IDynamicImagesGalleryState> {
  private images: any;
  private galleryImages: IGalleryImages[] = [];

  constructor(props: IDynamicImagesGalleryProps) {
    super(props);
    this.state = {
      images: [],
      isLoading: true,
      windowSize: this.props.webPartElem.getBoundingClientRect().width
    };
    console.log('Finished Constructor');
  }

  private async loadImages() {
    console.log('laodImages');
    console.log(this.props.imagesGallery);
    console.log(this.props.maxItems);

    const tenantUrl = `https://${location.host}`;
    const service = new DynamicImagesGalleryService(this.props.context);

    this.images = await service.getGalleryImages(this.props.imagesGallery, this.props.maxItems);
    for (const image of this.images) {
      this.galleryImages.push(
        {
          thumbUrl: `${tenantUrl}/_api/v2.0/sharePoint:${image.File.ServerRelativeUrl}:/driveItem/thumbnails/0/small/content?preferNoRedirect=true`,
          url: `${tenantUrl}/_api/v2.0/sharePoint:${image.File.ServerRelativeUrl}:/driveItem/thumbnails/0/large/content?preferNoRedirect=true`,
          id: `${image.File.Guid}`
        }
      );
    }
    console.log(this.galleryImages);
  }

  private handleResize(webpartboundary, event: Event): event is CustomEvent {
    this.setState({ windowSize: webpartboundary.width });
    return 'detail' in event;
  }

  public async componentDidMount() {
    console.log('componentDidMount');

    this.setState({ isLoading: true });
    this.galleryImages = [];
    await this.loadImages();
    this.setState({ images: this.galleryImages, isLoading: false });

    window.addEventListener('resize', (e: Event) => {
      this.handleResize(this.props.webPartElem.getBoundingClientRect(), e);
    });
  }

  public async componentWillUnmount() {
    window.removeEventListener('resize', (e: Event) => {
      this.handleResize(this.props.webPartElem.getBoundingClientRect(), e);
    });
  }

  public async componentDidUpdate(prevProps: IDynamicImagesGalleryProps, prevState: IDynamicImagesGalleryState) {
    console.log('componentDidUpdate');

    if (prevProps.imagesGallery !== this.props.imagesGallery || prevProps.maxItems !== this.props.maxItems) {
      this.setState({ isLoading: true });
      this.galleryImages = [];
      await this.loadImages();
      this.setState({ images: this.galleryImages, isLoading: false });
    }
  }

  public render(): React.ReactElement<IDynamicImagesGalleryProps> {
    console.log('Render');
    console.log(this.state.images);
    console.log(this.state.windowSize);

    let rowItems = 5;
    if (this.state.windowSize <= 750) {
      rowItems = 3;
    } else if (this.state.windowSize <= 980) {
      rowItems = 4;
    }

    return (
      <div className={styles.dynamicImagesGallery}>
        {
          <WebPartTitle displayMode={this.props.displayMode}
            title={this.props.title}
            updateProperty={this.props.updateProperty}
            moreLink={
              () => {
                return (<Link href="htttps://www.contoso.com">See all</Link>);
              }
            } />
          /* <WebPartTitle displayMode = { this.props.displayMode }
          title = { this.props.title }
          updateProperty = { this.props.updateProperty }
          moreLink = {
            () => {
              return( <Link href="htttps://www.contoso.com">See all</Link> );
            }
          } /> */}
        {
          this.state.isLoading ? <Spinner size={SpinnerSize.large} label='loading images...' /> :
            <DynamicImagesGalleryFocusZone
              items={this.state.images}
              size={(this.state.windowSize - 20 * (rowItems - 1)) / rowItems}
            />
        }
      </div>
    );
  }
}
