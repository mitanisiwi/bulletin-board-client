import Image from 'next/image'
import Head from "next/head"
import Link from "next/link"
import { Inter } from 'next/font/google'
import { Post } from '../../types';
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

type Props = {
  posts: Post[];
}

export async function getStaticProps() {
  const res = await fetch("https://bulletin-board-dyrv.onrender.com/api/v1/posts/");
  const posts = await res.json();

  console.log (posts);
  return {
    props: {
      posts,  
    },
    revalidate: 60 * 60 * 24,
  };
}

export default function Home({ posts }: Props) {
  const router = useRouter();
  const handleDelete = async(postId: string) => {
    try{
      await axios.delete(`https://bulletin-board-dyrv.onrender.com/api/v1/posts/${postId}`);
      router.reload();
    }catch(err){
      alert("削除に失敗しました");
    }
  };

  return (
  <>
  <div className={styles.container}>
    <h2>Bulletin Board</h2>
    <Link href="/create-post" className={ styles.createButton }  >
    Create new post
    </Link>
      
    <div >
      {posts.map((post: Post) => (
        <div key={ post.id } className={styles.postCard}>
          <Link href = {`posts/${post.id}`} className={styles.postCardBox}>
            <h2 > {post.title} </h2>
            </Link>
            <p> {post.content} </p>
            <Link href = {`edit-post/${post.id}`} >
            <button className={styles.editButton} >Edit</button>
            </Link>
            <button 
            className={styles.deleteButton}
            onClick ={() => handleDelete(post.id)}
            >Delete</button>
          
        </div>
      ))}
    </div>
  </div>
  </>
  )
}
