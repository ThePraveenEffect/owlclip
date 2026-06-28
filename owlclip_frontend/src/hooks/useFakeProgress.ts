'use client';

import { useEffect, useMemo, useState } from 'react';

const STAGES = [
  {
    title: 'Uploading video',
    description: 'Preparing your video for AI processing.',
  },
  {
    title: 'Understanding your content',
    description: 'Analyzing speech, scenes and pacing.',
  },
  {
    title: 'Finding viral moments',
    description: 'Ranking the best hooks and highlights.',
  },
  {
    title: 'Creating short clips',
    description: 'Generating clips optimized for social media.',
  },
  {
    title: 'Adding subtitles',
    description: 'Creating accurate animated captions.',
  },
  {
    title: 'Final quality check',
    description: 'Optimizing exports before delivery.',
  },
];

const ACTIVITIES = [
  'Video uploaded',
  'Audio extracted',
  'Speech detected',
  'Transcript generated',
  'Scene changes detected',
  'Best moments ranked',
  'Captions generated',
  'Video quality enhanced',
  'Rendering clips',
  'Packaging final files',
];

const TIPS = [
  '💡 Clips between 20–60 seconds usually perform best.',
  '💡 Captions can significantly improve watch time.',
  '💡 Landscape videos are automatically cropped.',
  '💡 AI ranks clips using speech, pacing and engagement.',
  '💡 Your clips will appear automatically when ready.',
];

export function useFakeProgress(isCompleted: boolean) {
  const [progress, setProgress] = useState(2);
  const [activityIndex, setActivityIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Progress Animation
  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((current) => {
        let increment = 0;

        if (current < 15) {
          increment = 2 + Math.random() * 2;
        } else if (current < 40) {
          increment = 0.8 + Math.random();
        } else if (current < 70) {
          increment = 0.45 + Math.random() * 0.4;
        } else if (current < 90) {
          increment = 0.18 + Math.random() * 0.18;
        } else if (current < 95) {
          increment = 0.08 + Math.random() * 0.08;
        } else if (current < 99) {
          increment = 0.02 + Math.random() * 0.03;
        } else {
          return 99;
        }

        return Math.min(current + increment, 99);
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isCompleted]);

  // Rotate activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) =>
        Math.min(prev + 1, ACTIVITIES.length - 1)
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const stage = useMemo(() => {
    if (progress < 20) return STAGES[0];
    if (progress < 40) return STAGES[1];
    if (progress < 65) return STAGES[2];
    if (progress < 85) return STAGES[3];
    if (progress < 95) return STAGES[4];
    return STAGES[5];
  }, [progress]);

  const milestones = [
    {
      label: 'Upload',
      done: progress >= 15,
      active: progress < 15,
    },
    {
      label: 'AI Analysis',
      done: progress >= 55,
      active: progress >= 15 && progress < 55,
    },
    {
      label: 'Clip Creation',
      done: progress >= 90,
      active: progress >= 55 && progress < 90,
    },
    {
      label: 'Finalizing',
      done: progress >= 100,
      active: progress >= 90,
    },
  ];

  return {
    progress: Math.floor(progress),

    stage,

    activities: ACTIVITIES.map((activity, index) => ({
      text: activity,
      completed: index < activityIndex,
      active: index === activityIndex,
    })),

    tip: TIPS[tipIndex],

    milestones,
  };
}