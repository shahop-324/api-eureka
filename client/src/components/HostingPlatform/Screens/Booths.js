import React, { useEffect } from 'react';
import { fetchBooths } from '../../../actions';
import './../Styles/booth.scss';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import BoothTagsFilterAndSearch from '../HelperComponents/boothTagsFilterAndSearch';
import BoothCard from '../HelperComponents/BoothCard';


const Booths = () => {

  const params = useParams();

  const communityId = params.communityId;
  const eventId = params.eventId;
  // const boothId = params.boothId;


const dispatch=useDispatch();
 useEffect(()=>{

  dispatch(fetchBooths(eventId));
 })
  return (
    <>
      <BoothTagsFilterAndSearch />
      {/* <div className="partner-booths-list-grid-layout mb-3">
        <BoothCard url="https://zouton.com/images/originals/blog/udemybanner_1589988705.png"/>
      </div> */}

      <div className="normal-booths-list-grid-layout">
       <BoothCard url="https://miro.medium.com/max/934/1*UfosUyZgOE97ntxNVuBFEg.png"/> 
        <BoothCard url="https://www.scdn.co/i/_global/open-graph-default.png"/>
        <BoothCard url="https://images.hindustantimes.com/tech/img/2020/06/29/960x540/Untitled_design_(2)_1593428059368_1593428070885.png"/>
        <BoothCard url="https://images.jansatta.com/2019/12/Flipkart-Picture.jpg?w=1200&h=800"/>
      </div>
    </>
  );
};

export default Booths;
