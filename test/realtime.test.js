'use strict'

/* eslint-env node, mocha */

const io = require('socket.io-client')
const http = require('http')

const mock = require('mock-require')
const assert = require('assert')

describe('realtime', function () {
  describe('extractNoteIdFromSocket', function () {
    before(() => {
      mock('../lib/config', {})
      mock('../lib/logger', {})
      mock('../lib/history', {})
      mock('../lib/models', {})
      realtime = require('../lib/realtime')
    })

    after(() => {
      mock.stopAll()
    })

    let realtime

    function makeMockSocket (headers, query) {
      return {
        handshake: {
          headers: Object.assign({}, headers),
          query: Object.assign({}, query)
        }
      }
    }

    it('return noteId from query', function () {
      // Arrange
      const incomingNoteId = 'myNoteId'
      const incomingSocket = makeMockSocket(undefined, {noteId: incomingNoteId})

      // Act
      const noteId = realtime.extractNoteIdFromSocket(incomingSocket)
      // Assert
      assert.strictEqual(noteId, incomingNoteId)
    })

    it('return noteId from old method (referrer)', function () {
      // Arrange
      const incomingNoteId = 'myNoteId'
      const incomingSocket = makeMockSocket({
        referer: `https://localhost:3000/${incomingNoteId}`
      })

      // Act
      const noteId = realtime.extractNoteIdFromSocket(incomingSocket)
      // Assert
      assert.strictEqual(noteId, incomingNoteId)
    })
  })
})
