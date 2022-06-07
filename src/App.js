import "regenerator-runtime/runtime";
import React from "react";
import { login, logout } from "./utils";
import "./global.css";

export default function App() {
  const [posts, setPost] = React.useState({
    id: null,
    title: null,
    body: null,
    author: null,
  });

  const [countId, setCountId] = React.useState({
    count: 0,
  });
  React.useEffect(() => {
    if (window.walletConnection.isSignedIn()) {
    }
  }, []);

  async function create_posts(title, body) {
    let post_id = await window.contract.create_posts({
      // pass the value that the user entered in the greeting field
      title: title,
      body: body,
    });
    console.log(post_id);
    setCountId({ count: post_id });
    let postId = countId.count;
    alert("Post successfully!", { postId });
  }
  async function get_posts(id) {
    try {
      let posts = await window.contract.get_posts({
        id: id,
      });
      console.log(posts);
      setPost({
        id: posts.id,
        title: posts.title,
        body: posts.body,
        author: posts.author,
      });
    } catch (error) {
      alert("Exist Id! ");
    }
  }
  async function edit_posts(id, title, body) {
    try {
      await window.contract.edit_posts({
        // pass the value that the user entered in the greeting field\
        id: id,
        title: title,
        body: body,
      });
      alert("Edit successfully!");
    } catch (error) {
      alert("Exist Id! ");
    }
  }

  async function delete_posts(id) {
    try {
      await window.contract.delete_posts({
        id: id,
      });
      alert("Delete successfully!");
    } catch (error) {
      alert("Exist Id! ");
    }
  }

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    );
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <div style={{ float: "right" }}>
        {window.accountId}
        <button className="link" onClick={logout}>
          Sign out
        </button>
      </div>
      <main>
        <h1></h1>

        <div style={{ marginBottom: "20px" }}>
          <h2>Create posts</h2>
          <div style={{ marginBottom: "10px" }}>
            <div>
              Title
              <input
                id="title-post"
                type="text"
                style={{ marginBottom: "10px" }}
              ></input>
            </div>

            <div>
              Body <input id="body-post" type="text"></input>
            </div>
          </div>
          <div>Posts id: {countId.count}</div>

          <button
            onClick={() => {
              let title = document.getElementById("title-post").value;
              let body = document.getElementById("body-post").value;
              create_posts(title, body);
            }}
          >
            Create post
          </button>
        </div>

        <div>
          <h2>Edit posts</h2>
          <div style={{ marginBottom: "10px" }}>
            <div>
              Id
              <input
                id="id-edit"
                type="text"
                style={{ marginBottom: "10px" }}
              ></input>
            </div>

            <div>
              Title
              <input
                id="title-edit"
                type="text"
                style={{ marginBottom: "10px" }}
              ></input>
            </div>

            <div>
              Body <input id="body-edit" type="text"></input>
            </div>
          </div>
          <button
            onClick={() => {
              let id = parseInt(document.getElementById("id-edit").value);
              let title = document.getElementById("title-edit").value;
              let body = document.getElementById("title-edit").value;
              edit_posts(id, title, body);
            }}
          >
            Edit post
          </button>
        </div>
        <div>
          <h2>Get posts</h2>
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                get_posts(
                  parseInt(document.getElementById("get-post-by-id").value)
                );
              }}
            >
              Get post
            </button>
            <input id="get-post-by-id" type="text"></input>
            <div>
              <table id="students">
                <thead>
                  <tr style={{ color: "darkgreen" }}>
                    <td style={{ width: "10%" }}>Id</td>
                    <td style={{ width: "20%" }}>Title</td>
                    <td style={{ width: "50%" }}>Body</td>
                    <td style={{ width: "20%" }}>Author</td>
                  </tr>
                </thead>
              </table>
              <table id="students">
                <thead>
                  <tr key={posts.id}>
                    <td style={{ width: "10%" }}>{posts.id}</td>
                    <td style={{ width: "20%" }}> {posts.title}</td>
                    <td style={{ width: "50%" }}>{posts.body}</td>
                    <td style={{ width: "20%" }}>{posts.author}</td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
        <div>
          <h2>Delete posts</h2>
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                delete_posts(
                  parseInt(document.getElementById("delete-id").value)
                );
              }}
            >
              Delete post
            </button>
            <input id="delete-id" type="text"></input>
          </div>
        </div>
      </main>
    </>
  );
}
