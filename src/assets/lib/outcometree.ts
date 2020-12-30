export interface Outcome {
  title: string,
  computedOutcome: number,
  verticalScaleValue: number,
  horizontalScaleValue: number,
  outcomeBudget: number,
  key: string,
  subOutcomes: Suboutcome[]
}

export interface Suboutcome {
  title: string,
  key: string,
  subOutcomeFunding: number,
  parent: Node,
  depts: Department[]
}

export interface Department {
  name: string
}

interface Node {
  children: Node[],
  value: Outcome | Suboutcome | null,
  parent: Node | null
}

var rootNode : Node = {
  children: [],
  value: null,
  parent: null
}

export const init = (outcomes : Outcome[]) => {
  
  const duplicate = (nodeArg : Node, nodeArr : Node[]) => {
    return (nodeArr.filter( node => JSON.stringify(node.value) == JSON.stringify(nodeArg.value)).length >= 1)
  }

  // build the tree
  outcomes.forEach( outcome => {
    addOutcome(outcome)
    outcome.subOutcomes.forEach( suboutcome => {
      addSuboutcome(suboutcome, outcome)
    })
  })

  // find duplcate suboutcomes
  let duplicateSuboutcomeNodes : Node[] = []

  outcomes.forEach( outcome => {
    outcome.subOutcomes.forEach( suboutcome => {
      let foundSuboutcomeNodes : Node[] = getNodes(suboutcome)
      if (foundSuboutcomeNodes.length > 1) {
        foundSuboutcomeNodes.forEach(suboutcomeNode => {
          if (!duplicate(suboutcomeNode, duplicateSuboutcomeNodes))
            duplicateSuboutcomeNodes.push(suboutcomeNode)
        })
      }
    })
  })

  // get the impacted sibling nodes from the duplicate nodes & append impacted suboutcomes to the duplicate suboutcome
  duplicateSuboutcomeNodes.forEach( duplicateSubOutcome => {

    let otherDuplicates = duplicateSuboutcomeNodes.filter( duplicate => duplicate.parent != duplicateSubOutcome.parent)

    otherDuplicates.forEach( duplicate => {
      let siblings : Node[] = getSiblings(duplicate)

      siblings.forEach( sibling => {
        console.log("Pushing " + sibling.value.title + " to " + duplicate.value.title)
        duplicate.children.push(sibling)
      })
    })
  })

  printTree()

}

const addOutcome = (outcome : Outcome) => {

  let outcomeNode : Node  = 
  {
    value: outcome,
    children: [],
    parent: rootNode
  }

  rootNode.children.push(outcomeNode)

}

const addSuboutcome = (suboutcome : Suboutcome, parent : Outcome) => {

  let parentNodes : Node[] = getNodes(parent)

  if (parentNodes.length > 1) {
    console.error("addSuboutcome: More than one parent node found")
    return
  }

  if (parentNodes.length == 0) {
    console.error("addSuboutcome: Parent node not found")
    return
  }

  let parentNode : Node = parentNodes[0]

  let newSuboutcomeNode : Node = {
    children: [],
    value: suboutcome,
    parent: parentNode
  }

  parentNode.children.push(newSuboutcomeNode)

}

// return array of nodes that contains the matching outcome or suboutcome
const getNodes = (input : Suboutcome | Outcome | null) : Node[] => {

  let stack : Node[] = []
  let matchingNodes : Node[] = []

  const helperGetNode = (node : Node) => {

    if (node.value && node.value.title == input.title) {
      matchingNodes.push(node)
    }

    if (node == undefined) {
      return null
    }

    node.children.forEach( node => {
      stack.push(node)
    })
    
    let nextNode = stack.shift()

    if (!nextNode) return

    helperGetNode(nextNode)
  }

  helperGetNode(rootNode)

  return matchingNodes
  
}

// return the sibling nodes to a given node
// TO-DO Not properly returning siblings atm
const getSiblings = (node : Node) : Node[] => {

  let siblingNodes : Node[] = [];

  let matchingNodes : Node[] = getNodes(node.value)

  matchingNodes.forEach( node => {
    let parentNode = node.parent

    parentNode?.children.forEach( node => {
      if (node != node) {
        siblingNodes.push(node)
      }
    })
  })  

  return siblingNodes
}

const printTree = () => {
  rootNode.children.forEach( node => {
    console.log("node: " + node?.value?.title)

    node.children.forEach( node => {
      console.log("        " + node?.value?.title)

      node.children.forEach( impactedSuboutcome => {
        console.log("                " + impactedSuboutcome?.value?.title)
      }) 
    })      
  })
}