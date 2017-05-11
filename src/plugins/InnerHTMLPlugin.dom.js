const updateInnerHTML = (oldNode, newNode) => {
  const oldHTML = oldNode.data.innerHTML
  const newHTML = newNode.data.innerHTML

  if (oldHTML === newHTML) {
    return
  }

  newNode.elm.innerHTML = newHTML || ''
}

export default {
  create: updateInnerHTML,
  update: updateInnerHTML
}
