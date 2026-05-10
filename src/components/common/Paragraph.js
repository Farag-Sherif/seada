import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useLanguage } from '../../helpers/Language/useLanguage';

const Paragraph = ({title, inner, line ,hrClass}) => {
    const { t } = useLanguage();
    
    return (
        <>
            <div className={title}>
                <h4>{t('special_offer')}</h4>
                <h2 className={inner}>{t('top_collection')}</h2>
                {
                    line ?
                        <div className="line"></div> : 
                    hrClass ?
                        <hr role="tournament6"></hr>
                    : ''
                }
            </div>
            <Container>
                <Row>
                    <Col lg="6" className="m-auto">
                        <div className="product-para">
                            <p className="text-center">{t('lorem_ipsum_text')}</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Paragraph;