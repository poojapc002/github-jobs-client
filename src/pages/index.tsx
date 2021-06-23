import React, { Component, useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { Button, JobView, Input, JobViewSkeleton, Modal } from '../components'
import { Job } from '../types'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [fullTime, setFullTime] = useState(false)

  const modalRef = useRef()

  const [final, setFinal] = useState({
    finalDescription: '',
    finalLocation: '',
    finalFullTime: false,
  })
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadMoreDisabled, setLoadMoreDisabled] = useState(false)

  const [mutate, { isLoading, error, data }] = useMutation(() =>
    fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://jobs.github.com/positions.json?page=${page}&description=${final.finalDescription}&location=${final.finalLocation}&full_time=${final.finalFullTime}`
      )}`
    )
      .then((res) => res.json())
      .then((data) => JSON.parse(data.contents))
  )

  useEffect(() => {
    setJobs([])
    mutate().then((data) => {
      setJobs(data)
      setDescription('')
      setLocation('')
      setFullTime(false)
    })
  }, [final])

  useEffect(() => {
    mutate().then((data) =>
      setJobs((prev: Job[]) => {
        // [...prev, ...data] and remove duplicates
        const allJobs = [...prev]
        data.forEach((_job) => {
          if (!allJobs.some((job) => job.id === _job.id)) {
            allJobs.push(_job)
          }
        })
        // if we do not get any more jobs even after increasing page
        // disable load more button
        if (page > 1 && prev.length === allJobs.length) {
          setLoadMoreDisabled(true)
        }
        return allJobs
      })
    )
  }, [page])

  useEffect(() => {
    function handler(event: MouseEvent) {
      if (
        !event.defaultPrevented &&
        !(modalRef.current as any)?.contains(event.target)
      ) {
        if (modalOpen) {
          setModalOpen(false)
        }
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [modalOpen, modalRef])

  if (error) return 'An error has occurred.'

  function Iframe(props) {
    return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
  }
  const iframe = '<iframe src="https://derekevans.herokuapp.com/jobsite" width="540" height="450"></iframe>'; 

  return (
    <>
       <Iframe iframe={iframe} />
      
    </>
  )
}
