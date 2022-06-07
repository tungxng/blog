/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::env::attached_deposit;
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{env, near_bindgen, setup_alloc, serde, AccountId};
use near_sdk::collections::{LookupMap, UnorderedMap};

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Blogs {
    records: LookupMap<String, String>,
    posts:UnorderedMap<usize,Post>,
    owner:AccountId,
    id:usize,
}

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Post {
    pub title: String,
    pub body: String,
    pub author: AccountId,
    pub id: usize,
}
impl Default for Blogs {
  fn default() -> Self {
    Self {
      records: LookupMap::new(b"records".to_vec()),
      posts:UnorderedMap::new(b"post ".to_vec()),
      owner:"demoday.testnet".to_string(),
      id:0
    }
  }
}

#[near_bindgen]
impl Blogs {
    pub fn  get_owner(&self) ->String {
        let owner = self.owner.clone();
        owner
    }

    pub fn create_posts(&mut self, title:String,body:String) ->usize{
        let author = env::signer_account_id();
        let post = Post {
            title:title,
            body:body,
            author:author,
            id:self.id
        };
        self.id = self.id+1;
        self.posts.insert(&post.id, &post);
        post.id
    }
    
    pub fn delete_posts(&mut self, id:usize) {
        let user_call = env::signer_account_id();
        assert_eq!(self.owner,user_call,"You not owner!");
        self.posts.remove(&id);
    }

    pub fn get_posts(&self, id:usize)->Post {
        self.posts.get(&id).unwrap().clone()
    }
    pub fn edit_posts(&mut self, id:usize, title:String,body:String) {
        let user_call = env::signer_account_id();
        let posts = self.posts.get(&id).unwrap();
        assert_eq!(user_call,posts.author,"You not author!");
        let author = posts.author;
        let id = posts.id;
        let post = Post{
            title,
            body,
            author,
            id
        };
        self.posts.insert(&post.id, &post);
    }

}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

}
