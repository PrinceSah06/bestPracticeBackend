import { describe, it, expect } from "bun:test";
import app from "../app";
// describe("Basic test", () => {
//     it("should add numbers correctly", () => {
//         expect(1 + 1).toBe(2);
//     });
// });
console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET)


// describe('api testing', async () => {

//     it("testing register api", async () => {

//         const res = await  app.request('/auth/register', {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 password: 'Prince',
//                 email: "abc@gmail.com",
//                 name:"prince"
//             })

//         });

//         expect(res.status).toBe(201)
//     })

// })

describe('api testing', async () => {

    it("testing login api",   
        async () => {

        const res = await  app.request('/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: 'Prince',
                email: "abc@gmail.com",
            })

        });
//  console.log(res)

expect(res.status).toBe(200)
    }),15000

})

// describe('login',async()=>{
//     it('testing all user ',()=>{


//     })
// })

