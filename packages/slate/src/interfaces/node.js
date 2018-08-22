import warning from 'slate-dev-warning'
import { List } from 'immutable'

import mixin from '../utils/mixin'
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import KeyUtils from '../utils/key-utils'
import memoize from '../utils/memoize'
import PathUtils from '../utils/path-utils'
import Text from '../models/text'

/**
 * The interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Class}
 */

class NodeInterface {
  /**
   * Get the concatenated text of the node.
   *
   * @return {String}
   */

  get text() {
    return this.getText()
  }

  /**
   * Add mark.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {Number} length
   * @param {Mark} mark
   * @return {Node}
   */

  addMark(path, offset, length, mark) {
    let node = this.assertDescendant(path)
    path = this.resolvePath(path)
    node = node.addMark(offset, length, mark)
    const ret = this.replaceNode(path, node)
    return ret
  }

  /**
   * Create a decoration with `properties` relative to the node.
   *
   * @param {Object|Decoration} properties
   * @return {Decoration}
   */

  createDecoration(properties) {
    properties = Decoration.createProperties(properties)
    const decoration = this.resolveDecoration(properties)
    return decoration
  }

  /**
   * Create a point with `properties` relative to the node.
   *
   * @param {Object|Point} properties
   * @return {Range}
   */

  createPoint(properties) {
    properties = Point.createProperties(properties)
    const point = this.resolvePoint(properties)
    return point
  }

  /**
   * Create a range with `properties` relative to the node.
   *
   * @param {Object|Range} properties
   * @return {Range}
   */

  createRange(properties) {
    properties = Range.createProperties(properties)
    const range = this.resolveRange(properties)
    return range
  }

  /**
   * Create a selection with `properties` relative to the node.
   *
   * @param {Object|Selection} properties
   * @return {Selection}
   */

  createSelection(properties) {
    properties = Selection.createProperties(properties)
    const selection = this.resolveSelection(properties)
    return selection
  }

  /**
   * Recursively filter all descendant nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {List<Node>}
   */

  filterDescendants(iterator) {
    const matches = []

    this.forEachDescendant((node, i, nodes) => {
      if (iterator(node, i, nodes)) matches.push(node)
    })

    return List(matches)
  }

  /**
   * Recursively find all descendant nodes by `iterator`.
   *
   * @param {Function} iterator
   * @return {Node|Null}
   */

  findDescendant(iterator) {
    let found = null

    this.forEachDescendant((node, i, nodes) => {
      if (iterator(node, i, nodes)) {
        found = node
        return false
      }
    })

    return found
  }

  /**
   * Recursively iterate over all descendant nodes with `iterator`. If the
   * iterator returns false it will break the loop.
   *
   * @param {Function} iterator
   */

  forEachDescendant(iterator) {
    let ret

    this.nodes.forEach((child, i, nodes) => {
      if (iterator(child, i, nodes) === false) {
        ret = false
        return false
      }

      if (child.object != 'text') {
        ret = child.forEachDescendant(iterator)
        return ret
      }
    })

    return ret
  }

  /**
   * Get a set of the active marks in a `range`.
   *
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getActiveMarksAtRange(range) {
    range = this.resolveRange(range)
    if (range.isUnset) return Set()

    if (range.isCollapsed) {
      const { start } = range
      return this.getMarksAtPosition(start.key, start.offset).toSet()
    }

    const { start, end } = range
    let startKey = start.key
    let startOffset = start.offset
    let endKey = end.key
    let endOffset = end.offset
    let startText = this.getDescendant(startKey)

    if (startKey !== endKey) {
      while (startKey !== endKey && endOffset === 0) {
        const endText = this.getPreviousText(endKey)
        endKey = endText.key
        endOffset = endText.text.length
      }

      while (startKey !== endKey && startOffset === startText.text.length) {
        startText = this.getNextText(startKey)
        startKey = startText.key
        startOffset = 0
      }
    }

    if (startKey === endKey) {
      return startText.getActiveMarksBetweenOffsets(startOffset, endOffset)
    }

    const startMarks = startText.getActiveMarksBetweenOffsets(
      startOffset,
      startText.text.length
    )
    if (startMarks.size === 0) return Set()
    const endText = this.getDescendant(endKey)
    const endMarks = endText.getActiveMarksBetweenOffsets(0, endOffset)
    let marks = startMarks.intersect(endMarks)
    // If marks is already empty, the active marks is empty
    if (marks.size === 0) return marks

    let text = this.getNextText(startKey)

    while (text.key !== endKey) {
      if (text.text.length !== 0) {
        marks = marks.intersect(text.getActiveMarks())
        if (marks.size === 0) return Set()
      }

      text = this.getNextText(text.key)
    }
    return marks
  }

  /**
   * Get a list of the ancestors of a descendant.
   *
   * @param {List|String} path
   * @return {List<Node>|Null}
   */

  getAncestors(path) {
    path = this.resolvePath(path)
    if (!path) return null

    const ancestors = []

    path.forEach((p, i) => {
      const current = path.slice(0, i)
      const parent = this.getNode(current)
      ancestors.push(parent)
    })

    return List(ancestors)
  }

  /**
   * Get the leaf block descendants of the node.
   *
   * @return {List<Node>}
   */

  getBlocks() {
    const array = this.getBlocksAsArray()
    return List(array)
  }

  /**
   * Get the leaf block descendants of the node.
   *
   * @return {List<Node>}
   */

  getBlocksAsArray() {
    return this.nodes.reduce((array, child) => {
      if (child.object != 'block') return array
      if (!child.isLeafBlock()) return array.concat(child.getBlocksAsArray())
      array.push(child)
      return array
    }, [])
  }

  /**
   * Get the leaf block descendants in a `range`.
   *
   * @param {Range} range
   * @return {List<Node>}
   */

  getBlocksAtRange(range) {
    const array = this.getBlocksAtRangeAsArray(range)
    // Eliminate duplicates by converting to an `OrderedSet` first.
    return List(OrderedSet(array))
  }

  /**
   * Get the leaf block descendants in a `range` as an array
   *
   * @param {Range} range
   * @return {Array}
   */

  getBlocksAtRangeAsArray(range) {
    range = this.resolveRange(range)
    if (range.isUnset) return []

    const { start, end } = range
    const startBlock = this.getClosestBlock(start.key)

    // PERF: the most common case is when the range is in a single block node,
    // where we can avoid a lot of iterating of the tree.
    if (start.key === end.key) return [startBlock]

    const endBlock = this.getClosestBlock(end.key)
    const blocks = this.getBlocksAsArray()
    const startIndex = blocks.indexOf(startBlock)
    const endIndex = blocks.indexOf(endBlock)
    return blocks.slice(startIndex, endIndex + 1)
  }

  /**
   * Get all of the leaf blocks that match a `type`.
   *
   * @param {String} type
   * @return {List<Node>}
   */

  getBlocksByType(type) {
    const array = this.getBlocksByTypeAsArray(type)
    return List(array)
  }

  /**
   * Get all of the leaf blocks that match a `type` as an array
   *
   * @param {String} type
   * @return {Array}
   */

  getBlocksByTypeAsArray(type) {
    return this.nodes.reduce((array, node) => {
      if (node.object != 'block') {
        return array
      } else if (node.isLeafBlock() && node.type == type) {
        array.push(node)
        return array
      } else {
        return array.concat(node.getBlocksByTypeAsArray(type))
      }
    }, [])
  }

  /**
   * Get a child node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getChild(path) {
    path = this.resolvePath(path)
    if (!path) return null
    const child = path.size === 1 ? this.nodes.get(path.first()) : null
    return child
  }

  /**
   * Get closest parent of node that matches an `iterator`.
   *
   * @param {List|String} path
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getClosest(path, iterator) {
    const ancestors = this.getAncestors(path)
    if (!ancestors) return null

    const closest = ancestors.findLast((node, ...args) => {
      // We never want to include the top-level node.
      if (node === this) return false
      return iterator(node, ...args)
    })

    return closest || null
  }

  /**
   * Get the closest block parent of a node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getClosestBlock(path) {
    const closest = this.getClosest(path, n => n.object === 'block')
    return closest
  }

  /**
   * Get the closest inline parent of a node by `path`.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getClosestInline(path) {
    const closest = this.getClosest(path, n => n.object === 'inline')
    return closest
  }

  /**
   * Get the closest void parent of a node by `path`.
   *
   * @param {List|String} path
   * @param {Schema} schema
   * @return {Node|Null}
   */

  getClosestVoid(path, schema) {
    if (!schema) {
      logger.deprecate(
        '0.38.0',
        'Calling the `Node.getClosestVoid` method without passing a second `schema` argument is deprecated.'
      )

      const closest = this.getClosest(path, p => p.get('isVoid'))
      return closest
    }

    const ancestors = this.getAncestors(path)
    const ancestor = ancestors.findLast(a => schema.isVoid(a))
    return ancestor
  }

  /**
   * Get the common ancestor of nodes `a` and `b`.
   *
   * @param {List} a
   * @param {List} b
   * @return {Node}
   */

  getCommonAncestor(a, b) {
    a = this.resolvePath(a)
    b = this.resolvePath(b)
    if (!a || !b) return null

    const path = PathUtils.relate(a, b)
    const node = this.getNode(path)
    return node
  }

  /**
   * Get the decorations for the node from a `stack`.
   *
   * @param {Stack} stack
   * @return {List}
   */

  getDecorations(stack) {
    const decorations = stack.find('decorateNode', this)
    const list = Decoration.createList(decorations || [])
    return list
  }

  /**
   * Get the depth of a descendant, with optional `startAt`.
   *
   * @param {List|String} path
   * @param {Number} startAt
   * @return {Number|Null}
   */

  getDepth(path, startAt = 1) {
    path = this.resolvePath(path)
    if (!path) return null

    const node = this.getNode(path)
    const depth = node ? path.size - 1 + startAt : null
    return depth
  }

  /**
   * Get a descendant node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getDescendant(path) {
    path = this.resolvePath(path)
    if (!path) return null

    const deep = path.flatMap(x => ['nodes', x])
    const ret = this.getIn(deep)
    return ret
  }

  /**
   * Get the first child text node.
   *
   * @return {Node|Null}
   */

  getFirstText() {
    let descendant = null

    const found = this.nodes.find(node => {
      if (node.object === 'text') return true
      descendant = node.getFirstText()
      return !!descendant
    })

    return descendant || found
  }

  /**
   * Get a fragment of the node at a `range`.
   *
   * @param {Range} range
   * @return {Document}
   */

  getFragmentAtRange(range) {
    range = this.resolveRange(range)

    if (range.isUnset) {
      return Document.create()
    }

    const { start, end } = range
    let node = this
    let targetPath = end.path
    let targetPosition = end.offset
    let mode = 'end'

    while (targetPath.size) {
      const index = targetPath.last()
      node = node.splitNode(targetPath, targetPosition)
      targetPosition = index + 1
      targetPath = PathUtils.lift(targetPath)

      if (!targetPath.size && mode === 'end') {
        targetPath = start.path
        targetPosition = start.offset
        mode = 'start'
      }
    }

    const startIndex = start.path.first() + 1
    const endIndex = end.path.first() + 2
    const nodes = node.nodes.slice(startIndex, endIndex)
    const fragment = Document.create({ nodes })
    return fragment
  }

  /**
   * Get the furthest parent of a node that matches an `iterator`.
   *
   * @param {Path} path
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getFurthest(path, iterator) {
    const ancestors = this.getAncestors(path)
    if (!ancestors) return null

    const furthest = ancestors.find((node, ...args) => {
      // We never want to include the top-level node.
      if (node === this) return false
      return iterator(node, ...args)
    })

    return furthest || null
  }

  /**
   * Get the furthest ancestor of a node.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestAncestor(path) {
    path = this.resolvePath(path)
    if (!path) return null
    const furthest = path.size ? this.nodes.get(path.first()) : null
    return furthest
  }

  /**
   * Get the furthest block parent of a node.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestBlock(path) {
    const furthest = this.getFurthest(path, n => n.object === 'block')
    return furthest
  }

  /**
   * Get the furthest inline parent of a node.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestInline(path) {
    const furthest = this.getFurthest(path, n => n.object === 'inline')
    return furthest
  }

  /**
   * Get the furthest ancestor of a node that has only one child.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestOnlyChildAncestor(path) {
    const ancestors = this.getAncestors(path)
    if (!ancestors) return null

    const furthest = ancestors
      .rest()
      .reverse()
      .takeUntil(p => p.nodes.size > 1)
      .last()

    return furthest || null
  }

  /**
   * Get the closest inline nodes for each text node in the node.
   *
   * @return {List<Node>}
   */

  getInlines() {
    const array = this.getInlinesAsArray()
    const list = List(array)
    return list
  }

  /**
   * Get the closest inline nodes for each text node in the node, as an array.
   *
   * @return {List<Node>}
   */

  getInlinesAsArray() {
    let array = []

    this.nodes.forEach(child => {
      if (child.object == 'text') return

      if (child.isLeafInline()) {
        array.push(child)
      } else {
        array = array.concat(child.getInlinesAsArray())
      }
    })

    return array
  }

  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Range} range
   * @return {List<Node>}
   */

  getInlinesAtRange(range) {
    const array = this.getInlinesAtRangeAsArray(range)
    // Remove duplicates by converting it to an `OrderedSet` first.
    const list = List(OrderedSet(array))
    return list
  }

  /**
   * Get the closest inline nodes for each text node in a `range` as an array.
   *
   * @param {Range} range
   * @return {Array}
   */

  getInlinesAtRangeAsArray(range) {
    range = this.resolveRange(range)
    if (range.isUnset) return []

    const array = this.getTextsAtRangeAsArray(range)
      .map(text => this.getClosestInline(text.key))
      .filter(exists => exists)

    return array
  }

  /**
   * Get all of the leaf inline nodes that match a `type`.
   *
   * @param {String} type
   * @return {List<Node>}
   */

  getInlinesByType(type) {
    const array = this.getInlinesByTypeAsArray(type)
    const list = List(array)
    return list
  }

  /**
   * Get all of the leaf inline nodes that match a `type` as an array.
   *
   * @param {String} type
   * @return {Array}
   */

  getInlinesByTypeAsArray(type) {
    const array = this.nodes.reduce((inlines, node) => {
      if (node.object == 'text') {
        return inlines
      } else if (node.isLeafInline() && node.type == type) {
        inlines.push(node)
        return inlines
      } else {
        return inlines.concat(node.getInlinesByTypeAsArray(type))
      }
    }, [])

    return array
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getInsertMarksAtRange(range) {
    range = this.resolveRange(range)
    const { start } = range

    if (range.isUnset) {
      return Set()
    }

    if (range.isCollapsed) {
      // PERF: range is not cachable, use key and offset as proxies for cache
      return this.getMarksAtPosition(start.key, start.offset)
    }

    const text = this.getDescendant(start.key)
    const marks = text.getMarksAtIndex(start.offset + 1)
    return marks
  }

  /**
   * Get an object mapping all the keys in the node to their paths.
   *
   * @return {Object}
   */

  getKeysToPathsTable() {
    const ret = {
      [this.key]: [],
    }

    this.nodes.forEach((node, i) => {
      const nested = node.getKeysToPathsTable()

      for (const key in nested) {
        const path = nested[key]

        if (ret[key]) {
          logger.warn(
            `A node with a duplicate key of "${key}" was found! Duplicate keys are not allowed, you should use \`node.regenerateKey\` before inserting if you are reusing an existing node.`,
            this
          )
        }

        ret[key] = [i, ...path]
      }
    })

    return ret
  }

  /**
   * Get the last child text node.
   *
   * @return {Node|Null}
   */

  getLastText() {
    let descendant = null

    const found = this.nodes.findLast(node => {
      if (node.object == 'text') return true
      descendant = node.getLastText()
      return descendant
    })

    return descendant || found
  }

  /**
   * Get all of the marks for all of the characters of every text node.
   *
   * @return {Set<Mark>}
   */

  getMarks() {
    const array = this.getMarksAsArray()
    return Set(array)
  }

  /**
   * Get all of the marks as an array.
   *
   * @return {Array}
   */

  getMarksAsArray() {
    const result = []

    this.nodes.forEach(node => {
      result.push(node.getMarksAsArray())
    })

    // PERF: use only one concat rather than multiple for speed.
    const array = [].concat(...result)
    return array
  }

  /**
   * Get a set of marks in a `position`, the equivalent of a collapsed range
   *
   * @param {string} key
   * @param {number} offset
   * @return {Set}
   */

  getMarksAtPosition(key, offset) {
    const text = this.getDescendant(key)
    const currentMarks = text.getMarksAtIndex(offset)
    if (offset !== 0) return currentMarks
    const closestBlock = this.getClosestBlock(key)

    if (closestBlock.text === '') {
      // insert mark for empty block; the empty block are often created by split node or add marks in a range including empty blocks
      return currentMarks
    }

    const previous = this.getPreviousText(key)
    if (!previous) return Set()

    if (closestBlock.hasDescendant(previous.key)) {
      return previous.getMarksAtIndex(previous.text.length)
    }

    return currentMarks
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getMarksAtRange(range) {
    const marks = Set(this.getOrderedMarksAtRange(range))
    return marks
  }

  /**
   * Get all of the marks that match a `type`.
   *
   * @param {String} type
   * @return {Set<Mark>}
   */

  getMarksByType(type) {
    const array = this.getMarksByTypeAsArray(type)
    return Set(array)
  }

  /**
   * Get all of the marks that match a `type` as an array.
   *
   * @param {String} type
   * @return {Array}
   */

  getMarksByTypeAsArray(type) {
    const array = this.nodes.reduce((memo, node) => {
      return node.object == 'text'
        ? memo.concat(node.getMarksAsArray().filter(m => m.type == type))
        : memo.concat(node.getMarksByTypeAsArray(type))
    }, [])

    return array
  }

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNextBlock(key) {
    const child = this.assertDescendant(key)
    let last

    if (child.object == 'block') {
      last = child.getLastText()
    } else {
      const block = this.getClosestBlock(key)
      last = block.getLastText()
    }

    const next = this.getNextText(last.key)
    if (!next) return null

    const closest = this.getClosestBlock(next.key)
    return closest
  }

  /**
   * Get the next node in the tree from a node.
   *
   * This will not only check for siblings but instead move up the tree
   * returning the next ancestor if no sibling is found.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNextNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null

    for (let i = path.size; i > 0; i--) {
      const p = path.slice(0, i)
      const target = PathUtils.increment(p)
      const node = this.getNode(target)
      if (node) return node
    }

    return null
  }

  /**
   * Get the next sibling of a node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNextSibling(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const p = PathUtils.increment(path)
    const sibling = this.getNode(p)
    return sibling
  }

  /**
   * Get the text node after a descendant text node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNextText(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const next = this.getNextNode(path)
    if (!next) return null
    const text = next.getFirstText()
    return text
  }

  /**
   * Get a node in the tree.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    const node = path.size ? this.getDescendant(path) : this
    return node
  }

  /**
   * Get the offset for a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Number}
   */

  getOffset(key) {
    this.assertDescendant(key)

    // Calculate the offset of the nodes before the highest child.
    const child = this.getFurthestAncestor(key)
    const offset = this.nodes
      .takeUntil(n => n == child)
      .reduce((memo, n) => memo + n.text.length, 0)

    // Recurse if need be.
    const ret = this.hasChild(key) ? offset : offset + child.getOffset(key)
    return ret
  }

  /**
   * Get the offset from a `range`.
   *
   * @param {Range} range
   * @return {Number}
   */

  getOffsetAtRange(range) {
    range = this.resolveRange(range)

    if (range.isUnset) {
      throw new Error('The range cannot be unset to calculcate its offset.')
    }

    if (range.isExpanded) {
      throw new Error('The range must be collapsed to calculcate its offset.')
    }

    const { start } = range
    const offset = this.getOffset(start.key) + start.offset
    return offset
  }

  /**
   * Get all of the marks for all of the characters of every text node.
   *
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarks() {
    const array = this.getMarksAsArray()
    return OrderedSet(array)
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Range} range
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarksAtRange(range) {
    range = this.resolveRange(range)
    const { start, end } = range

    if (range.isUnset) {
      return OrderedSet()
    }

    if (range.isCollapsed) {
      // PERF: range is not cachable, use key and offset as proxies for cache
      return this.getMarksAtPosition(start.key, start.offset)
    }

    const marks = this.getOrderedMarksBetweenPositions(
      start.key,
      start.offset,
      end.key,
      end.offset
    )

    return marks
  }

  /**
   * Get a set of the marks in a `range`.
   * PERF: arguments use key and offset for utilizing cache
   *
   * @param {string} startKey
   * @param {number} startOffset
   * @param {string} endKey
   * @param {number} endOffset
   * @returns {OrderedSet<Mark>}
   */

  getOrderedMarksBetweenPositions(startKey, startOffset, endKey, endOffset) {
    if (startKey === endKey) {
      const startText = this.getDescendant(startKey)
      return startText.getMarksBetweenOffsets(startOffset, endOffset)
    }

    const texts = this.getTextsBetweenPositionsAsArray(startKey, endKey)

    return OrderedSet().withMutations(result => {
      texts.forEach(text => {
        if (text.key === startKey) {
          result.union(
            text.getMarksBetweenOffsets(startOffset, text.text.length)
          )
        } else if (text.key === endKey) {
          result.union(text.getMarksBetweenOffsets(0, endOffset))
        } else {
          result.union(text.getMarks())
        }
      })
    })
  }

  /**
   * Get all of the marks that match a `type`.
   *
   * @param {String} type
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarksByType(type) {
    const array = this.getMarksByTypeAsArray(type)
    return OrderedSet(array)
  }

  /**
   * Get the parent of a descendant node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getParent(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const parentPath = PathUtils.lift(path)
    const parent = this.getNode(parentPath)
    return parent
  }

  /**
   * Find the path to a node.
   *
   * @param {String|List} key
   * @return {List}
   */

  getPath(key) {
    // Handle the case of passing in a path directly, to match other methods.
    if (List.isList(key)) return key

    const dict = this.getKeysToPathsTable()
    const path = dict[key]
    return path ? List(path) : null
  }

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getPreviousBlock(key) {
    const child = this.assertDescendant(key)
    let first

    if (child.object == 'block') {
      first = child.getFirstText()
    } else {
      const block = this.getClosestBlock(key)
      first = block.getFirstText()
    }

    const previous = this.getPreviousText(first.key)
    if (!previous) return null

    const closest = this.getClosestBlock(previous.key)
    return closest
  }

  /**
   * Get the previous node from a node in the tree.
   *
   * This will not only check for siblings but instead move up the tree
   * returning the previous ancestor if no sibling is found.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getPreviousNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null

    for (let i = path.size; i > 0; i--) {
      const p = path.slice(0, i)
      if (p.last() === 0) continue

      const target = PathUtils.decrement(p)
      const node = this.getNode(target)
      if (node) return node
    }

    return null
  }

  /**
   * Get the previous sibling of a node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getPreviousSibling(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    if (path.last() === 0) return null
    const p = PathUtils.decrement(path)
    const sibling = this.getNode(p)
    return sibling
  }

  /**
   * Get the text node after a descendant text node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getPreviousText(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const previous = this.getPreviousNode(path)
    if (!previous) return null
    const text = previous.getLastText()
    return text
  }

  /**
   * Get the indexes of the selection for a `range`, given an extra flag for
   * whether the node `isSelected`, to determine whether not finding matches
   * means everything is selected or nothing is.
   *
   * @param {Range} range
   * @param {Boolean} isSelected
   * @return {Object|Null}
   */

  getSelectionIndexes(range, isSelected = true) {
    const { start, end } = range

    // PERF: if we're not selected, we can exit early.
    if (!isSelected) {
      return null
    }

    // if we've been given an invalid selection we can exit early.
    if (range.isUnset) {
      return null
    }

    // PERF: if the start and end keys are the same, just check for the child
    // that contains that single key.
    if (start.key == end.key) {
      const child = this.getFurthestAncestor(start.key)
      const index = child ? this.nodes.indexOf(child) : null
      return { start: index, end: index + 1 }
    }

    // Otherwise, check all of the children...
    let startIndex = null
    let endIndex = null

    this.nodes.forEach((child, i) => {
      if (child.object == 'text') {
        if (startIndex == null && child.key == start.key) startIndex = i
        if (endIndex == null && child.key == end.key) endIndex = i + 1
      } else {
        if (startIndex == null && child.hasDescendant(start.key)) startIndex = i
        if (endIndex == null && child.hasDescendant(end.key)) endIndex = i + 1
      }

      // PERF: exit early if both start and end have been found.
      return startIndex == null || endIndex == null
    })

    if (isSelected && startIndex == null) startIndex = 0
    if (isSelected && endIndex == null) endIndex = this.nodes.size
    return startIndex == null ? null : { start: startIndex, end: endIndex }
  }

  /**
   * Get the concatenated text string of all child nodes.
   *
   * @return {String}
   */

  getText() {
    const text = this.nodes.reduce((string, node) => {
      return string + node.text
    }, '')

    return text
  }

  /**
   * Get the descendent text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node|Null}
   */

  getTextAtOffset(offset) {
    // PERF: Add a few shortcuts for the obvious cases.
    if (offset === 0) return this.getFirstText()
    if (offset === this.text.length) return this.getLastText()
    if (offset < 0 || offset > this.text.length) return null

    let length = 0
    const text = this.getTexts().find((node, i, nodes) => {
      length += node.text.length
      return length > offset
    })

    return text
  }

  /**
   * Get the direction of the node's text.
   *
   * @return {String}
   */

  getTextDirection() {
    const dir = direction(this.text)
    return dir === 'neutral' ? null : dir
  }

  /**
   * Recursively get all of the child text nodes in order of appearance.
   *
   * @return {List<Node>}
   */

  getTexts() {
    const array = this.getTextsAsArray()
    return List(array)
  }

  /**
   * Recursively get all the leaf text nodes in order of appearance, as array.
   *
   * @return {List<Node>}
   */

  getTextsAsArray() {
    let array = []

    this.nodes.forEach(node => {
      if (node.object == 'text') {
        array.push(node)
      } else {
        array = array.concat(node.getTextsAsArray())
      }
    })

    return array
  }

  /**
   * Get all of the text nodes in a `range`.
   *
   * @param {Range} range
   * @return {List<Node>}
   */

  getTextsAtRange(range) {
    range = this.resolveRange(range)
    if (range.isUnset) return List()
    const { start, end } = range
    const list = List(this.getTextsBetweenPositionsAsArray(start.key, end.key))

    return list
  }

  /**
   * Get all of the text nodes in a `range` as an array.
   *
   * @param {Range} range
   * @return {Array}
   */

  getTextsAtRangeAsArray(range) {
    range = this.resolveRange(range)
    if (range.isUnset) return []
    const { start, end } = range
    const texts = this.getTextsBetweenPositionsAsArray(start.key, end.key)
    return texts
  }

  /**
   * Get all of the text nodes in a `range` as an array.
   * PERF: use key in arguments for cache
   *
   * @param {string} startKey
   * @param {string} endKey
   * @returns {Array}
   */

  getTextsBetweenPositionsAsArray(startKey, endKey) {
    const startText = this.getDescendant(startKey)

    // PERF: the most common case is when the range is in a single text node,
    // where we can avoid a lot of iterating of the tree.
    if (startKey == endKey) return [startText]

    const endText = this.getDescendant(endKey)
    const texts = this.getTextsAsArray()
    const start = texts.indexOf(startText)
    const end = texts.indexOf(endText, start)
    const ret = texts.slice(start, end + 1)
    return ret
  }

  /**
   * Check if the node has block children.
   *
   * @return {Boolean}
   */

  hasBlockChildren() {
    return !!(this.nodes && this.nodes.find(n => n.object === 'block'))
  }

  /**
   * Check if a child node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasChild(path) {
    const child = this.getChild(path)
    return !!child
  }

  /**
   * Check if a node has inline children.
   *
   * @return {Boolean}
   */

  hasInlineChildren() {
    return !!(
      this.nodes &&
      this.nodes.find(n => n.object === 'inline' || n.object === 'text')
    )
  }

  /**
   * Recursively check if a child node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasDescendant(path) {
    const descendant = this.getDescendant(path)
    return !!descendant
  }

  /**
   * Recursively check if a node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasNode(path) {
    const node = this.getNode(path)
    return !!node
  }

  /**
   * Check if a node has a void parent.
   *
   * @param {List|String} path
   * @param {Schema} schema
   * @return {Boolean}
   */

  hasVoidParent(path, schema) {
    if (!schema) {
      logger.deprecate(
        '0.38.0',
        'Calling the `Node.hasVoidParent` method without the second `schema` argument is deprecated.'
      )

      const closest = this.getClosestVoid(path)
      return !!closest
    }

    const closest = this.getClosestVoid(path, schema)
    return !!closest
  }

  /**
   * Insert a `node`.
   *
   * @param {List|String} path
   * @param {Node} node
   * @return {Node}
   */

  insertNode(path, node) {
    path = this.resolvePath(path)
    const index = path.last()
    const parentPath = PathUtils.lift(path)
    let parent = this.assertNode(parentPath)
    const nodes = parent.nodes.splice(index, 0, node)
    parent = parent.set('nodes', nodes)
    const ret = this.replaceNode(parentPath, parent)
    return ret
  }

  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {String} text
   * @param {Set} marks
   * @return {Node}
   */

  insertText(path, offset, text, marks) {
    let node = this.assertDescendant(path)
    path = this.resolvePath(path)
    node = node.insertText(offset, text, marks)
    const ret = this.replaceNode(path, node)
    return ret
  }

  /**
   * Check whether the node is a leaf block.
   *
   * @return {Boolean}
   */

  isLeafBlock() {
    return (
      this.object === 'block' && this.nodes.every(n => n.object !== 'block')
    )
  }

  /**
   * Check whether the node is a leaf inline.
   *
   * @return {Boolean}
   */

  getFirstInvalidNode(schema) {
    if (this.object === 'text') {
      const invalid = this.validate(schema) ? this : null
      return invalid
    }

    let invalid = null

    this.nodes.find(n => {
      invalid = n.validate(schema) ? n : n.getFirstInvalidNode(schema)
      return invalid
    })

    return invalid
  }

  /**
   * Get the first text node of a node, or the node itself.
   *
   * @return {Node|Null}
   */

  getFirstText() {
    if (this.object === 'text') {
      return this
    }

    let descendant = null

    const found = this.nodes.find(node => {
      if (node.object === 'text') return true
      descendant = node.getFirstText()
      return !!descendant
    })

    return descendant || found
  }

  /**
   * Get an object mapping all the keys in the node to their paths.
   *
   * @return {Object}
   */

  getKeysToPathsTable() {
    const ret = {
      [this.key]: [],
    }

    if (this.nodes) {
      this.nodes.forEach((node, i) => {
        const nested = node.getKeysToPathsTable()

        for (const key in nested) {
          const path = nested[key]

          warning(
            !(key in ret),
            `A node with a duplicate key of "${key}" was found! Duplicate keys are not allowed, you should use \`node.regenerateKey\` before inserting if you are reusing an existing node.`
          )

          ret[key] = [i, ...path]
        }
      })
    }

    return ret
  }

  /**
   * Get the last text node of a node, or the node itself.
   *
   * @return {Node|Null}
   */

  getLastText() {
    if (this.object === 'text') {
      return this
    }

    let descendant = null

    const found = this.nodes.findLast(node => {
      if (node.object == 'text') return true
      descendant = node.getLastText()
      return descendant
    })

    return descendant || found
  }

  /**
   * Get a node in the tree, or the node itself.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (this.object === 'text' && path.size) return null
    const node = path.size ? this.getDescendant(path) : this
    return node
  }

  /**
   * Find the path to a node.
   *
   * @param {String|List} key
   * @return {List}
   */

  getPath(key) {
    // Handle the case of passing in a path directly, to match other methods.
    if (List.isList(key)) return key

    const dict = this.getKeysToPathsTable()
    const path = dict[key]
    return path ? List(path) : null
  }

  /**
   * Get the concatenated text string of a node.
   *
   * @return {String}
   */

  getText() {
    const children = this.object === 'text' ? this.leaves : this.nodes
    const text = children.reduce((memo, c) => memo + c.text, '')
    return text
  }

  /**
   * Check if a node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasNode(path) {
    const node = this.getNode(path)
    return !!node
  }

  /**
   * Normalize the text node with a `schema`.
   *
   * @param {Schema} schema
   * @return {Function|Void}
   */

  normalize(schema) {
    const normalizer = schema.normalizeNode(this)
    return normalizer
  }

  /**
   * Regenerate the node's key.
   *
   * @return {Node}
   */

  regenerateKey() {
    const key = KeyUtils.create()
    const node = this.set('key', key)
    return node
  }

  /**
   * Resolve a path from a path list or key string.
   *
   * An `index` can be provided, in which case paths created from a key string
   * will have the index pushed onto them. This is helpful in cases where you
   * want to accept either a `path` or a `key, index` combination for targeting
   * a location in the tree that doesn't exist yet, like when inserting.
   *
   * @param {List|String} value
   * @param {Number} index
   * @return {List}
   */

  resolvePath(path, index) {
    if (typeof path === 'string') {
      path = this.getPath(path)

      if (index != null) {
        path = path.concat(index)
      }
    } else {
      path = PathUtils.create(path)
    }

    return path
  }

  /**
   * Validate the node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Error|Void}
   */

  validate(schema) {
    const error = schema.validateNode(this)
    return error
  }
}

/**
 * Memoize read methods.
 */

memoize(NodeInterface.prototype, [
<<<<<<< HEAD
=======
  'getBlocksAsArray',
  'getBlocksAtRangeAsArray',
  'getBlocksByTypeAsArray',
  'getDecorations',
>>>>>>> master
  'getFirstInvalidNode',
  'getFirstText',
  'getKeysToPathsTable',
  'getLastText',
  'getText',
  'normalize',
  'validate',
])

/**
 * Mix in the node interface.
 */

mixin(NodeInterface, [Block, Document, Inline, Text])
