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

interface OutcomeNode extends Node {
  value: Outcome
  parent: RootNode
}

interface SuboutcomeNode extends Node {
  value: Suboutcome
  parent: OutcomeNode
}

interface RootNode extends Node {
  children: OutcomeNode[]
  value: null,
  parent: null
}

var rootNode : RootNode = {
  children: [],
  value: null,
  parent: null
}

export const init = (outcomes : Outcome[]) => {
  
  // build the tree
  outcomes.forEach( outcome => {
    addOutcome(outcome)
    outcome.subOutcomes.forEach( suboutcome => {
      addSuboutcome(suboutcome, outcome)
    })
  })

  //printTree()

}

export const adjustOutcomeValue = (inputOutcome : Outcome, newValue : number) => {

  let difference = newValue - inputOutcome.outcomeBudget
  inputOutcome.outcomeBudget = newValue
  inputOutcome.key += inputOutcome.key.toString()

  let impactedSuboutcomeNodesArray : SuboutcomeNode[] = []
  inputOutcome.subOutcomes.forEach( suboutcome => {
    suboutcome.subOutcomeFunding += (difference/inputOutcome.subOutcomes.length)

    let impactedSuboutcomeNodes = getImpactedSuboutcomes(suboutcome)
    if (impactedSuboutcomeNodes.length > 0) {
      impactedSuboutcomeNodes.forEach(impactedSuboutcomeNode => {
        updateSuboutcomeNode(impactedSuboutcomeNode, newValue)
        impactedSuboutcomeNodesArray.push(impactedSuboutcomeNode)
      })
    }

  })

  let siblings : OutcomeNode[] = rootNode.children.filter( outcomeNode => {
    return outcomeNode.value != inputOutcome
  })

  // If there are no impacted suboutcomes, update the the other outcomes
  if (impactedSuboutcomeNodesArray.length == 0) {
    updateSiblingOutcomes(siblings, difference / siblings.length)
  }
  // If there are impacted nodes, then skip the nodes that have already have their values set (as corresponding suboutcomes must remain in sync)
  else {
    impactedSuboutcomeNodesArray.forEach( impactedSuboutcome => {

      let delta = difference / rootNode.children.length-1
      let impactedParent = impactedSuboutcome.parent
      impactedParent.value.outcomeBudget -= delta
      impactedParent.value.key += "1"

      // TO-DO Find what value to plug in here
      updateSuboutcomeNode(impactedSuboutcome, )
    })
  }
}

const getImpactedSuboutcomes = (suboutcome : Suboutcome) : SuboutcomeNode[] => {
  return getNodes(suboutcome).filter( suboutcomenode => suboutcomenode.value != suboutcome) as SuboutcomeNode[]
}

export const adjustSuboutcomeValue = ( suboutcome : Suboutcome, newValue : number) => {
  
  let nodes = getNodes(suboutcome)

  nodes.forEach( node => {
    updateSuboutcomeNode(node as SuboutcomeNode, newValue)
  })
}

const updateSuboutcomeNode = (node : SuboutcomeNode, newValue : number) => {

  let suboutcomeNode = node as SuboutcomeNode
  let difference = newValue - suboutcomeNode.value.subOutcomeFunding

  // update the node
  suboutcomeNode.value.subOutcomeFunding = newValue
  suboutcomeNode.value.key = node?.value?.key + "1"

  updateSuboutcomeSiblings(node, difference)
}

const updateSiblingOutcomes = (outcomeNodeSiblings : OutcomeNode[], delta : number) => {

  let impactedOutcomes : Outcome[] = []
  outcomeNodeSiblings.forEach( sibling => {
    impactedOutcomes.push(sibling.value)
  })

  impactedOutcomes.forEach(outcome => {
    outcome.outcomeBudget -= delta
    outcome.key += outcome.key.toString()

    outcome.subOutcomes.forEach( suboutcome => {
      suboutcome.subOutcomeFunding -= (delta/outcome.subOutcomes.length)
    })

  })
}

const updateSuboutcomeSiblings = (node : SuboutcomeNode, difference : number) => {

  let siblings : Node[] | undefined = node.parent?.children.filter( lNode => lNode != node)

  let delta = (difference / siblings.length)

  // update the siblings of the suboutcome
  siblings?.forEach( sibling => {
    let siblingNode = sibling as SuboutcomeNode

    siblingNode.value.subOutcomeFunding -= delta
    siblingNode.value.key += "1"
  })
}

const addOutcome = (outcome : Outcome) => {

  let outcomeNode : OutcomeNode  = 
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

    if (node.value && node.value.title == input?.title) {
      matchingNodes.push(node)
    }

    if (node == undefined) {
      return null
    }

    node.children.forEach( node => {
      stack.push(node as Node)
    })
    
    let nextNode = stack.shift()

    if (!nextNode) return

    helperGetNode(nextNode)
  }

  helperGetNode(rootNode as Node)

  return matchingNodes
  
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