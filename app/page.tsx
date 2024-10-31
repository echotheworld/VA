'use client'

import React, { useState } from 'react'
import { DraggableList } from '@/components/DraggableList'
import { GripVertical, Edit, Trash, Copy, ChevronDown, ChevronUp, Download, Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sectionTypes = [
  'Instrumental',
  'Verse 1',
  'Verse 2',
  'Verse 3',
  'Pre-Chorus',
  'Chorus 1',
  'Chorus 2',
  'Bridge',
  'Coda 1',
  'Coda 2',
  'Tag',
  'End',
  'Custom'
]

export default function LyricsArranger() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [project, setProject] = useState([])
  const [expandedLyrics, setExpandedLyrics] = useState({})
  const [editingLyric, setEditingLyric] = useState(null)
  const [customSection, setCustomSection] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [lyricsContent, setLyricsContent] = useState('')
  const [editingSection, setEditingSection] = useState(null) // Added for editing functionality
  const [songTitle, setSongTitle] = useState('') // Added for song title input
  const [artist, setArtist] = useState('') // Added for artist input


  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    // Implement search logic here
  }

  const handleSectionSelect = (section) => {
    if (section === 'Custom') {
      setSelectedSection('')
    } else {
      setSelectedSection(section)
    }
  }

  const addToProject = () => {
    if (!lyricsContent) return
    
    const sectionTitle = selectedSection || customSection
    if (!sectionTitle) return

    const newSection = {
      id: `section-${Date.now()}`,
      type: sectionTitle,
      content: lyricsContent,
      songTitle: songTitle, // Updated to include song title
      artist: artist // Updated to include artist
    }

    setProject([...project, newSection])
    setLyricsContent('')
    setSelectedSection('')
    setCustomSection('')
    setSongTitle('') // Clear title after adding
    setArtist('') // Clear artist after adding
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
  
    const newProject = Array.from(project);
    const [removed] = newProject.splice(sourceIndex, 1);
    newProject.splice(destinationIndex, 0, removed);
  
    setProject(newProject);
  };

  const toggleLyrics = (id) => {
    setExpandedLyrics(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const deleteLyric = (id) => {
    setProject(project.filter(item => item.id !== id))
  }

  const duplicateLyric = (lyric) => {
    const newLyric = { ...lyric, id: `${lyric.id}-copy-${Date.now()}` }
    setProject([...project, newLyric])
  }


  const exportToPDF = () => {
    // Implement PDF export logic
    const content = project.map(section => 
      `${section.type}\n${section.content}`
    ).join('\n\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lyrics_arrangement.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white p-8 flex justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Lyrics Mixer</h1>
        
        <Tabs defaultValue="lyrics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="songs">Search Songs</TabsTrigger>
            <TabsTrigger value="lyrics">Add Lyrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="songs">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for a song or artist"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </TabsContent>

          <TabsContent value="lyrics" className="space-y-4">
            <Input
              type="text"
              placeholder="Song Title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="mb-4"
            />
            
            <div className="flex flex-wrap gap-2">
              {sectionTypes.map(section => (
                <Button
                  key={section}
                  variant={selectedSection === section ? "default" : "outline"}
                  onClick={() => handleSectionSelect(section)}
                  className="h-auto py-2 px-4 text-sm"
                >
                  {section}
                </Button>
              ))}
            </div>
            
            {selectedSection === '' && (
              <Input
                type="text"
                placeholder="Enter custom section title"
                value={customSection}
                onChange={(e) => setCustomSection(e.target.value)}
                className="mt-4"
              />
            )}

            <Textarea
              placeholder="Enter lyrics content..."
              value={lyricsContent}
              onChange={(e) => setLyricsContent(e.target.value)}
              className="min-h-[200px]"
            />

            <Button 
              onClick={addToProject}
              className="w-full"
              disabled={!lyricsContent || (!selectedSection && !customSection)}
            >
              Add to Project
            </Button>
          </TabsContent>
        </Tabs>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Project</h2>
          
          {project.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sections added to the project yet</p>
          ) : (
            <DraggableList
              project={project}
              onDragEnd={onDragEnd}
              renderItem={(provided, snapshot, section) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={`group ${snapshot.isDragging ? 'z-50' : ''}`}
                >
                  <Card className="border border-gray-200 hover:border-black transition-colors duration-200">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing hover:bg-gray-100 p-1 rounded">
                          <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </div>
                        <div className="flex-grow">
                          <div 
                            className="flex items-center justify-between"
                            onClick={() => toggleLyrics(section.id)}
                          >
                            <h3 className="font-semibold">
                              {section.type}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteLyric(section.id); }}>
                                <Trash className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); duplicateLyric(section); }}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditingSection(section); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              {expandedLyrics[section.id] ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {expandedLyrics[section.id] && (
                        <p className="mt-4 pl-8 whitespace-pre-line text-gray-700">{section.content}</p>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            />
          )}
        </Card>

        <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}> {/* Added Edit Dialog */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
            </DialogHeader>
            {editingSection && (
              <>
                <Input
                  value={editingSection.type}
                  onChange={(e) => setEditingSection({...editingSection, type: e.target.value})}
                  className="mb-4"
                />
                <Textarea
                  value={editingSection.content}
                  onChange={(e) => setEditingSection({...editingSection, content: e.target.value})}
                  rows={10}
                />
                <Button onClick={() => {
                  setProject(project.map(s => s.id === editingSection.id ? editingSection : s))
                  setEditingSection(null)
                }}>
                  Save Changes
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>

        {project.length > 0 && (
          <Button onClick={exportToPDF} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Export as PDF
          </Button>
        )}
      </div>
    </div>
  )
}