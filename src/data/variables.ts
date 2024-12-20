interface Variable {
  id: string;
  type: 'variable';
  name: string;
  value: string;
  tags: string[];
  selectedTag?: string;
  separator?: string;
  isLocked?: boolean;
}

export const variables: Variable[] = [
  {
    id: 'photography-style',
    type: 'variable',
    name: 'Photography Style',
    value: '',
    tags: ['Candid photography', 'Documentary photography', 'Lifestyle photography', 'Surrealist photography']
  },
  {
    id: 'subject',
    type: 'variable',
    name: 'Subject',
    value: '',
    tags: ['Young woman', 'Elderly person', 'Fashion model', 'Modern skyscraper']
  },
  {
    id: 'important-details',
    type: 'variable',
    name: 'Important Details',
    value: '',
    tags: ['Long blonde hair', 'Reflecting on water', 'Wearing casual clothes', 'Dramatic shadows']
  },
  {
    id: 'background',
    type: 'variable',
    name: 'Background',
    value: '',
    tags: ['Blurred city skyline', 'Misty forest', 'Ocean waves', 'Mountain vista']
  },
  {
    id: 'pose-action',
    type: 'variable',
    name: 'Pose or Action',
    value: '',
    tags: ['Sitting with legs crossed', 'Standing with hands on hips', 'Walking through a busy market', 'Laughing with eyes closed']
  },
  {
    id: 'framing',
    type: 'variable',
    name: 'Framing',
    value: '',
    tags: ['Close-up on face', 'Medium shot from the waist up', 'Full-body shot', 'Over-the-shoulder framing', 'Symmetrical composition']
  },
  {
    id: 'lighting',
    type: 'variable',
    name: 'Lighting',
    value: '',
    tags: ['Natural sunlight', 'Studio lighting', 'Dramatic shadows', 'Soft diffused light', 'Golden hour lighting']
  },
  {
    id: 'camera-angle',
    type: 'variable',
    name: 'Camera Angle',
    value: '',
    tags: ['Eye level', 'Low angle', 'High angle', 'Dutch angle', 'Birds eye view']
  },
  {
    id: 'camera-properties',
    type: 'variable',
    name: 'Camera Properties',
    value: '',
    tags: ['Shallow depth of field', 'Wide aperture', 'Long exposure', 'High ISO', 'Fast shutter speed']
  },
  {
    id: 'photographer-style',
    type: 'variable',
    name: 'Photographer Style',
    value: '',
    tags: ['Annie Leibovitz', 'Steve McCurry', 'Henri Cartier-Bresson', 'Ansel Adams', 'Richard Avedon']
  },
  {
    id: 'special-effects',
    type: 'variable',
    name: 'Special Effects',
    value: '',
    tags: ['Motion blur', 'Double exposure', 'Light trails', 'Lens flare', 'Color filters']
  }
];
