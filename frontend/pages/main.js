import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useRouter } from 'next/router'
import api from '../utils/api.js'


export default function Main() {
  const [resume, setResume] = useState(null)
  const [transcript, setTranscript] = useState(null)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // handle file selections
  function handleResumeUpload(e) {
    setResume(e.target.files[0])
  }

  function handleTranscriptUpload(e) {
    setTranscript(e.target.files[0])
  }

  // upload helper function
  async function uploadFile(userId, file, fileType) {
    const filePath = `${userId}/${Date.now()}_${file.name}`

    const { error: storageError } = await supabase.storage
      .from('userfiles')
      .upload(filePath, file)

    if (storageError) {
      console.error("Storage error:", storageError)
      return { error: storageError }
    }

    // insert metadata
    const { error: tableError } = await supabase
      .from('user_files')
      .insert([
        {
          user_id: userId,
          file_name: file.name,
          file_type: fileType,
          storage_path: filePath
        }
      ])

    if (tableError) {
      console.error("Table insert error:", tableError)
      return { error: tableError }
    }

    return { success: true }
  }

  // continue button
  async function handleContinue() {
    setMessage('')
    setMessage('Processing...')

    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      setMessage('You must be signed in')
      return
    }

    const userId = data.user.id

    if (!resume && !transcript) {
      setMessage('Please upload at least one file')
      return
    }

    let profileJson = null

    // Process resume through backend if uploaded
    if (resume) {
      // First upload to Supabase storage
      const storageRes = await uploadFile(userId, resume, 'resume')
      if (storageRes.error) {
        setMessage('Error uploading resume to storage')
        return
      }

      // Then send to backend for processing
      try {
        setMessage('Extracting data from resume...')
        const processRes = await api.uploadResume(resume)
        if (processRes.success && processRes.profile) {
          profileJson = processRes.profile
          setMessage('Resume processed successfully! Matching scholarships...')
          
          // Match scholarships with the extracted profile
          try {
            const matchRes = await api.matchScholarships(profileJson)
            if (matchRes.success && matchRes.matches) {
              setMessage('Scholarships matched! Redirecting...')
            }
          } catch (matchErr) {
            console.error('Matching error:', matchErr)
            // Continue even if matching fails
          }
        } else {
          setMessage('Resume uploaded but processing incomplete')
        }
      } catch (processErr) {
        console.error('Resume processing error:', processErr)
        setMessage('Resume uploaded but could not be processed')
      }
    }

    // upload transcript (only to storage, no backend processing yet)
    if (transcript) {
      const res = await uploadFile(userId, transcript, 'transcript')
      if (res.error) {
        setMessage('Error uploading transcript')
        return
      }
    }

    if (!resume) {
      setMessage('Files uploaded successfully')
    }

    // client-side redirect
    setTimeout(() => {
      router.push('/scholarships')
    }, 1500)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-10"
      style={{
        background:
          'linear-gradient(to bottom right, rgb(255,220,230), rgb(210,255,220))',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1 className="text-4xl font-bold mb-10" style={{ color: 'black' }}>
        Upload Your Documents
      </h1>

      {message && (
        <div
          className="mb-6 p-4 rounded text-center"
          style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
            color: 'black'
          }}
        >
          {message}
        </div>
      )}

      <div className="max-w-3xl w-full space-y-10">
        {/* resume */}
        <div
          className="p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'black' }}>
            Resume (PDF only)
          </h2>

          <label
            htmlFor="resume-upload"
            className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer"
            style={{
              borderColor: 'black',
              color: 'black',
              backgroundColor: 'rgba(255,255,255,0.8)',
              cursor: 'pointer'
            }}
          >
            {resume ? resume.name : 'Click to upload PDF'}
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleResumeUpload}
            />
          </label>
        </div>

        {/* transcript */}
        <div
          className="p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'black' }}>
            Transcript (PDF only)
          </h2>

          <label
            htmlFor="transcript-upload"
            className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer"
            style={{
              borderColor: 'black',
              color: 'black',
              backgroundColor: 'rgba(255,255,255,0.8)',
              cursor: 'pointer'
            }}
          >
            {transcript ? transcript.name : 'Click to upload PDF'}
            <input
              id="transcript-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleTranscriptUpload}
            />
          </label>
        </div>

        {/* continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-full shadow-lg text-lg font-semibold hover:bg-gray-200 transition"
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: '2px solid black',
            cursor: 'pointer'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
