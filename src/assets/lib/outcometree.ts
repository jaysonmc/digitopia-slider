export interface Outcome {
  title: string;
  computedOutcome: number;
  verticalScaleValue: number;
  horizontalScaleValue: number;
  outcomeBudget: number;
  key: string;
  subOutcomes: Suboutcome[];
}

export interface Suboutcome {
  title: string;
  key: string;
  subOutcomeFunding: number;
  parent: Node;
  depts: Department[];
}

export interface Department {
  name: string;
}

interface Node {
  children: Node[];
  value: Outcome | Suboutcome | null;
  parent: Node | null;
}

interface OutcomeNode extends Node {
  children: SuboutcomeNode[];
  value: Outcome;
  parent: RootNode;
}

interface SuboutcomeNode extends Node {
  value: Suboutcome;
  parent: OutcomeNode;
}

interface RootNode extends Node {
  children: OutcomeNode[];
  value: null;
  parent: null;
}

var rootNode: RootNode = {
  children: [],
  value: null,
  parent: null,
};

export const init = (outcomes: Outcome[]) => {
  // build the tree
  outcomes.forEach((outcome) => {
    addOutcome(outcome);
    outcome.subOutcomes.forEach((suboutcome) => {
      addSuboutcome(suboutcome, outcome);
    });
  });

  //printTree()
};

export const adjustOutcomeValue = (
  inputOutcome: Outcome,
  newValue: number,
  cascade: boolean = false
) => {
  let difference = newValue - inputOutcome.outcomeBudget;

  let updatedSuboutcomes: SuboutcomeNode[] = [];

  let modifiedOutcomeNode: OutcomeNode = rootNode.children.filter(
    (outcome) => outcome.value == inputOutcome
  )[0];

  updateOutcome(modifiedOutcomeNode, difference, updatedSuboutcomes);

  if (!cascade) return;

  let otherOutcomes = rootNode.children.filter(
    (outcome) => outcome.value != inputOutcome
  );

  otherOutcomes.forEach((outcome) => {
    updateOutcome(
      outcome,
      -(difference / (rootNode.children.length - 1)),
      updatedSuboutcomes
    );
  });
};

export const adjustSuboutcomeValue = (
  suboutcome: Suboutcome,
  newValue: number,
  cascade: boolean = false
) => {
  let nodes = getNodes(suboutcome);

  nodes.forEach((node) => {
    updateSuboutcomeNode(node as SuboutcomeNode, newValue, cascade);
  });
};

const getMatchingSuboutcomes = (array1: Node[], array2: Node[]): Node[] => {
  let previouslyUpdatedSuboutcomes: Node[] = [];
  array1.forEach((suboutcomeNode1) => {
    let foundSuboutcomes: Node[] = array2.filter((suboutcomeNode2) => {
      suboutcomeNode2 == suboutcomeNode1;
    });

    if (foundSuboutcomes.length > 1) {
      console.error(
        "getMatchingSuboutcomes: Outcome has two identical suboutcomes"
      );
    }

    if (foundSuboutcomes.length == 1) {
      previouslyUpdatedSuboutcomes.push(foundSuboutcomes[0]);
    }
  });
  return previouslyUpdatedSuboutcomes;
};

const updateOutcome = (
  OutcomeNode: OutcomeNode,
  difference: number,
  modifiedSuboutcomes: SuboutcomeNode[]
) => {
  OutcomeNode.value.outcomeBudget += difference;
  OutcomeNode.value.key += "1";

  let previouslyUpdatedSuboutcomes: Node[] = getMatchingSuboutcomes(
    modifiedSuboutcomes,
    OutcomeNode.children
  );

  OutcomeNode.children.forEach((suboutcomeNode) => {
    if (!previouslyUpdatedSuboutcomes.includes(suboutcomeNode)) {
      let _suboutcomeNode = suboutcomeNode as SuboutcomeNode;

      _suboutcomeNode.value.subOutcomeFunding +=
        difference /
        (OutcomeNode.children.length - previouslyUpdatedSuboutcomes.length);
      _suboutcomeNode.value.key += "1";

      modifiedSuboutcomes.push(_suboutcomeNode);
    }
  });
};

const updateSuboutcomeNode = (
  node: SuboutcomeNode,
  newValue: number,
  cascade: boolean = false
) => {
  let updatedSiblings : SuboutcomeNode[] = [];
  let suboutcomeNode = node as SuboutcomeNode;
  let difference = newValue - suboutcomeNode.value.subOutcomeFunding;

  // update the node
  suboutcomeNode.value.subOutcomeFunding = newValue;
  suboutcomeNode.value.key = node?.value?.key + "1";

  if (cascade) {
    updatedSiblings = updateSuboutcomeSiblings(node, difference);
  } else {
    node.parent.value.outcomeBudget += difference;
    node.parent.value.key += "1";
  }

  updatedSiblings.forEach( siblingNode => {
    let matchingSuboutcomeNodes = <SuboutcomeNode[]>getNodes(siblingNode.value);
    if (matchingSuboutcomeNodes.length > 1) {
      let impactedNodes : SuboutcomeNode[] = matchingSuboutcomeNodes.filter( suboutcomeNode => {
        return suboutcomeNode.parent != node.parent
      })
      impactedNodes.forEach( impactedSubOutcomeNode => {
        updateSuboutcomeNode(impactedSubOutcomeNode, siblingNode.value.subOutcomeFunding, true)
      })
    }
  })

};

const updateSuboutcomeSiblings = (node: SuboutcomeNode, difference: number) : SuboutcomeNode[] => {
  let siblings: SuboutcomeNode[] | undefined = node.parent?.children.filter(
    (lNode) => lNode != node
  );

  let delta = difference / siblings.length;

  // update the siblings of the suboutcome
  siblings?.forEach((sibling) => {
    let siblingNode = sibling as SuboutcomeNode;

    siblingNode.value.subOutcomeFunding -= delta;
    siblingNode.value.key += "1";
  });

  return siblings
};

const addOutcome = (outcome: Outcome) => {
  let outcomeNode: OutcomeNode = {
    value: outcome,
    children: [],
    parent: rootNode,
  };

  rootNode.children.push(outcomeNode);
};

const addSuboutcome = (suboutcome: Suboutcome, parent: Outcome) => {
  let parentNodes: Node[] = getNodes(parent);

  if (parentNodes.length > 1) {
    console.error("addSuboutcome: More than one parent node found");
    return;
  }

  if (parentNodes.length == 0) {
    console.error("addSuboutcome: Parent node not found");
    return;
  }

  let parentNode: Node = parentNodes[0];

  let newSuboutcomeNode: Node = {
    children: [],
    value: suboutcome,
    parent: parentNode,
  };

  parentNode.children.push(newSuboutcomeNode);
};

// return array of nodes that contains the matching outcome or suboutcome
const getNodes = (input: Suboutcome | Outcome | null): Node[] => {
  let stack: Node[] = [];
  let matchingNodes: Node[] = [];

  const helperGetNode = (node: Node) => {
    if (node.value && node.value.title == input?.title) {
      matchingNodes.push(node);
    }

    if (node == undefined) {
      return null;
    }

    node.children.forEach((node) => {
      stack.push(node as Node);
    });

    let nextNode = stack.shift();

    if (!nextNode) return;

    helperGetNode(nextNode);
  };

  helperGetNode(rootNode as Node);

  return matchingNodes;
};

const printTree = () => {
  rootNode.children.forEach((node) => {
    console.log("node: " + node?.value?.title);

    node.children.forEach((node) => {
      console.log("        " + node?.value?.title);

      node.children.forEach((impactedSuboutcome) => {
        console.log("                " + impactedSuboutcome?.value?.title);
      });
    });
  });
};
