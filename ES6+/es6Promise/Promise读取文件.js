const fs = require('fs')

// fs.readFile('./为学.md', (err, data) => {
//   if (err) throw err;
//   console.log(data.toString())
// })

const p = new Promise((res, rej) => {
  fs.readFile('./为学.msd', (err, data) => {
    if (err) rej(err);
    res(data)
  })
})

p.then(res => {
  console.log(res.toString())
}).catch(err => {
  console.log(err)
})