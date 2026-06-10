// 'use server'

// import {cookies} from 'next/headers';
// import {redirect} from 'next/navigation';

// export async function checkUserToken(){
//     const cookieStore =  await cookies();

//     const accessToken = cookieStore.get('access_token')?.value;
//     const refreshToken = cookieStore.get('refresh_token')?.value;




//     if (!accessToken && refreshToken) {
//      const res = await fetch(
//         `${process.env.BACKEND_URL}/api/v1/auth/refresh`,
//         {
//             method:'POST',
//             headers:{
//                 "Content-Type": "application/json",
//             },
//             credentials: 'include'
//         }
//      );

//         if(res.ok){
//             const data = await res.json();
            
//             return data.accessToken;
//         } else {
//             // redirect('/login');
//         }
//   }

//   return accessToken;

// }
