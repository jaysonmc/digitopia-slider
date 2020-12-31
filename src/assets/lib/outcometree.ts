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
}

interface SuboutcomeNode extends Node {
  value: Suboutcome
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
  duplicateSuboutcomeNodes.forEach( duplicateSubOutcomeNode => {

    let implactedSuboutcome = duplicateSuboutcomeNodes.filter( duplicate => duplicate.parent != duplicateSubOutcomeNode.parent)

    implactedSuboutcome.forEach( duplicate => { 
      let siblings = duplicate.parent?.children.filter( node => node != duplicate)
      siblings?.forEach( sibling => {
        duplicateSubOutcomeNode.children.push(sibling)
      })
    })
  })

  //printTree()

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

export const adjustOutcomeValue = (inputOutcome : Outcome, newValue : number) => {

  let difference = newValue - inputOutcome.outcomeBudget
  inputOutcome.outcomeBudget = newValue
  inputOutcome.key += inputOutcome.key.toString()

  let siblings : OutcomeNode[] = rootNode.children.filter( outcomeNode => {
    return outcomeNode.value != inputOutcome
  })

  let delta = difference / siblings.length

  let impactedOutcomes : Outcome[] = []
  siblings.forEach( sibling => {
    impactedOutcomes.push(sibling.value)
  })

  impactedOutcomes.map(outcome => {

    outcome.outcomeBudget -= delta
    outcome.key += inputOutcome.key.toString()

    return outcome
  })

}

export const adjustSuboutcomeValue = ( suboutcome : Suboutcome, newValue : number) => {
  
  let difference = newValue - suboutcome.subOutcomeFunding
  
  let nodes = getNodes(suboutcome)

  nodes.forEach( node => {
    
    let suboutcomeNode = node as SuboutcomeNode

    suboutcomeNode.value.subOutcomeFunding = newValue
    suboutcomeNode.value.key = node?.value?.key + suboutcome.key.toString()
  })

  nodes.forEach( node => {
    let siblings : Node[] | undefined = node.parent?.children.filter( lNode => lNode != node)
    
    if (!siblings) return

    let delta = (difference / siblings.length)

    siblings?.forEach( sibling => {

      let siblingNode = sibling as SuboutcomeNode

      siblingNode.value.subOutcomeFunding -= delta
      siblingNode.value.key += suboutcome.key.toString()

    })

  })
  



}