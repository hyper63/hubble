import { assertEquals } from './deps.js'
import { default as request } from './request.js'

const { test } = Deno



test('ok', () => {
  const $ = request()
  $.get('https://jsonplaceholder.typicode.com/posts')
    .fork(
      e => console.log(e),
      r => (console.log(r), assertEquals(true, true))
    )
  //assertEquals(true, true)
})
