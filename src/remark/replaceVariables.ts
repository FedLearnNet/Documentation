import type {Plugin} from 'unified';
import {visit} from 'unist-util-visit';

type ReplaceVariablesOptions = {
  variables: Record<string, string>;
};

const tokenPattern = /%%([A-Z0-9_]+)%%/g;

function replaceTokens(value: string, variables: Record<string, string>): string {
  return value.replace(tokenPattern, (match, name: string) => {
    return variables[name] ?? match;
  });
}

const replaceVariables: Plugin<[ReplaceVariablesOptions]> = ({variables}) => {
  return (tree) => {
    visit(tree, (node: {type?: string; value?: unknown}) => {
      if (
        typeof node.value === 'string' &&
        (node.type === 'text' || node.type === 'yaml')
      ) {
        node.value = replaceTokens(node.value, variables);
      }
    });
  };
};

export default replaceVariables;
