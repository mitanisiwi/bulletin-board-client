import React from 'react'
import {Post} from "../../../types"
import { useRouter } from 'next/router';
import  styles  from '@/styles/Home.module.css';

type Props = {
  post: Post;
};

//pages/posts/[id].tsx
export async function getStaticPaths() {
  const res = await fetch("https://bulletin-board-dyrv.onrender.com/api/v1/posts/");
  const posts: Post[] = await res.json();

  const paths = posts.map((post) => ({
    params: {id: post.id.toString()},
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps( {params} : {params: { id: string }}) {
  const res = await fetch(`https://bulletin-board-dyrv.onrender.com/api/v1/posts/${params.id}`);
  const post = await res.json();

  console.log (post);
  return {
    props: {
      post,
    },
    revalidate: 60*60*24,
  };
}

const Post = ( {post}: Props ) => {
  const router = useRouter();

  if (router.isFallback){
    return <div>Loading..</div>
  }
  return (
    <div className={styles.container}>
      <div className={styles.title}> {post.title} </div>
      <div className={styles.created_at}> {post.created_at} </div>
      <div className={styles.content}> {post.content} </div>
    </div>
  )
};

export default Post
