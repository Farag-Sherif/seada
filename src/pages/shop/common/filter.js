import React from 'react';
import { Col, Media } from 'reactstrap';
import NewProduct from './newProduct';
import Category from './category';
import Brand from './brand'
import Color from './color'
import Size from './size'
import Price from './price';

const FilterPage = ({sm,sidebarView,closeSidebar,  categories }) => {
    return (
        <>
            <Col sm={sm} className="collection-filter" style={sidebarView ? {left:"0px"} : {}}>
                {/* <!-- side-bar colleps block stat --> */}
                <div className="collection-filter-block">
                    {/* <!-- brand filter start --> */}
                    <div className="collection-mobile-back" onClick={() => closeSidebar()}>
                        <span className="filter-back">
                            <i className="fa fa-angle-left" aria-hidden="true"></i> back
                        </span>
                    </div>
                    <Category categories={categories}/>
                   
                    {/* <Size/> */}
                    <Price />
                </div>
               
                {/* <!-- side-bar banner end here --> */}
            </Col>
        </>
    )
}

export default FilterPage;