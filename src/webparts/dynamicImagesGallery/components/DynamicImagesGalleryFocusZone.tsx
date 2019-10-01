import * as React from 'react';
import { useState } from 'react';
import {
    Image,
    FocusZone,
    IImageProps,
    ImageFit,
    mergeStyleSets,
    getTheme
} from 'office-ui-fabric-react';
import { IGalleryImages } from './IGalleryImages';

//react-image-lightbox
//https://www.npmjs.com/package/react-image-lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const theme = getTheme();
const classNames = mergeStyleSets({
    List: {
        marginRight: -25
    },
    GridCell: {
        position: 'relative',
        display: 'inline-block',
        boxSizing: 'border-box',
        padding: 0,
        marginRight: 20,
        marginBottom: 20,
        cursor: 'pointer',
        selectors: {
            '&:focus': {
                outline: 'none'
            },
            '&:focus:after': {
                content: '""',
                position: 'absolute',
                right: 4,
                left: 4,
                top: 4,
                bottom: 4,
                outline: '4px solid ' + theme.palette.themeLighterAlt
            }
        }
    }
});

const imageProps: IImageProps = {
    imageFit: ImageFit.cover
};

export const DynamicImagesGalleryFocusZone: React.FunctionComponent<{ items: IGalleryImages[], size: number }> = ({ items, size }) => {
    const [lightbox, setLightboxState] = useState({ photoIndex: 0, isOpen: false });
    console.log('FocusZone');
    console.log(items.length);
    console.log(lightbox.isOpen);
    return (
        <FocusZone as='div' className={classNames.List} isCircularNavigation={true}>
            {items.map((item: IGalleryImages, i: number) => (
                <div
                    key={item.id}
                    className={classNames.GridCell}
                    aria-posinset={i + 1}
                    aria-setsize={items.length}
                    aria-label="Images"
                    data-is-focusable={true}
                    onClick={() => setLightboxState({ photoIndex: i, isOpen: true })}
                >
                    <Image {...imageProps as any} src={item.thumbUrl} width={size} height={size} />
                </div>
            ))}
            {
                lightbox.isOpen &&
                <Lightbox
                    mainSrc={items[lightbox.photoIndex].url}
                    nextSrc={items[lightbox.photoIndex].url}
                    prevSrc={items[(lightbox.photoIndex + items.length - 1) % items.length].url}
                    onCloseRequest={() => setLightboxState({ photoIndex: 0, isOpen: false })}
                    onMovePrevRequest={() => setLightboxState({ photoIndex: (lightbox.photoIndex + items.length - 1) % items.length, isOpen: true })}
                    onMoveNextRequest={() => setLightboxState({ photoIndex: (lightbox.photoIndex + 1) % items.length, isOpen: true })}
                />
            }
        </FocusZone>
    );
};