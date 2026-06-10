'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserProfile({ user }: any) {
  const [open, setOpen] = useState(false);

  const OWLCLIP_AVATARS = [
    {
      id: 'founder',
      url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=founder&backgroundColor=b6e3f4&radius=50',
    },
  ];

  const router = useRouter();


  return (
    <div className="relative">
      
      {/* CLICKABLE USER SECTION */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-4 rounded-xl p-2 hover:bg-muted transition"
      >
        <img
          src={user?.avatar_url || OWLCLIP_AVATARS[0].url}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="text-sm font-medium text-foreground">
          {user?.username}
        </span>
      </button>

      {/* POPUP */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card shadow-xl p-4 z-50">
          
          {/* <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || OWLCLIP_AVATARS[0].url}
              alt="User Avatar"
              className="w-14 h-14 rounded-full"
            />

            <div>
              <h3 className="font-semibold">
                {user?.username}
              </h3>

              <p className="text-sm text-zinc-500">
                {user?.email}
              </p>
            </div>
          </div> */}

          <div className="border-t border-border pt-1 flex flex-col gap-2">
            
            <button onClick={()=> router.push("/dashboard")} className="text-left text-sm text-foreground hover:bg-muted p-2 rounded-lg">
              Dashboard
            </button>
            
            <button className="text-left text-sm text-foreground hover:bg-muted p-2 rounded-lg">
              Settings
            </button>


          </div>
        </div>
      )}
    </div>
  );
}
