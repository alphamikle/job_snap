import { SourceHandler } from './source-handler';
import { clearUrl } from '../utils/tools';

const salaryRegExp = /\$(?<from>\d+)K( - \$(?<to>\d+)K)?/;

export class YCombinatorSourceHandler implements SourceHandler {
  get code(): string {
    return 'workatastartup';
  }

  findCompanyName(): string {
    const node = this.companyNode;
    if (node === null) {
      return '';
    }
    return node.textContent ?? '';
  }

  findCompanyLink(): string {
    const node = this.companyNode;
    if (node === null) {
      return '';
    }
    return clearUrl(node.href ?? '');
  }

  findJobTitle(): string {
    const node = this.jobDescriptionNode;
    return node?.textContent ?? '';
  }

  findJobLink(): string {
    return clearUrl(window.location.href);
  }

  findRangeStart(): string {
    const salaryNode = this.salaryRangeNode;
    if (salaryNode === null) {
      return '';
    }
    const salaryMatch = (salaryNode.textContent ?? '').match(salaryRegExp);
    if (salaryMatch === null) {
      return '';
    }
    const from = parseFloat(salaryMatch.groups!.from);
    if (Number.isNaN(from)) {
      return ``;
    }
    return `=${from * 1000}`;
  }

  findRangeEnd(): string {
    const salaryNode = this.salaryRangeNode;
    if (salaryNode === null) {
      return '';
    }
    const salaryMatch = (salaryNode.textContent ?? '').match(salaryRegExp);
    if (salaryMatch === null) {
      return '';
    }
    const to = parseFloat(salaryMatch.groups!.to);
    if (Number.isNaN(to)) {
      return ``;
    }
    return `=${to * 1000}`;
  }

  get companyNode(): HTMLLinkElement | null {
    return document.querySelector('.company-details > nav > div > div:nth-child(3) > a');
  }

  get jobDescriptionNode(): Element | null {
    return document.querySelector('.company-details .company-title .company-name');
  }

  get salaryRangeNode(): Element | null {
    return document.querySelector('.company-details .company-title .text-gray-500');
  }
}