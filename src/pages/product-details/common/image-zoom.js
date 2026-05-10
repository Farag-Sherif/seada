import React from 'react';
import { Media } from 'reactstrap';

const ImageZoom = (props) => {
    const { image } = props;

    return (
        <Media src={`${image.src}`} alt={image.alt} className="img-fluid image_zoom_cls-0" style={{objectFit:'cover'}} />
    );
}

export default ImageZoom;
