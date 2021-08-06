import React, { Component, useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { Button, JobView, Input, JobViewSkeleton, Modal } from '../components'
import { Job } from '../types'

export default function Home() {
  
  function Iframe(props) {
    return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
  }
  const iframe = '<iframe src="https://derekevans.herokuapp.com/jobsite" width="100%" height="750" allowtransparency="true" allowfullscreen="true"></iframe>'; 

  return (
    <>
       <Iframe iframe={iframe} />
      
    </>
  )
}
