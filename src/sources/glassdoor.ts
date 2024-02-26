import { SourceHandler } from './source-handler';
import { clearUrl, hourRateToYear } from '../utils/tools';

const salaryRegExp = /\$(?<amount>\d+)/;

export class GlassDoorSourceHandler implements SourceHandler {
  get code(): string {
    return 'glassdoor';
  }

  findCompanyName(): string {
    const node = this.companyNameNode;
    if (node === null) {
      return '';
    }
    return node.textContent ?? '';
  }

  findCompanyLink(): string {
    const node = this.companyLinkNode;
    if (node === null) {
      return '';
    }
    return node.href ?? '';
  }

  findJobTitle(): string {
    const node = this.jobDescriptionNode;
    return node?.textContent ?? '';
  }

  findJobLink(): string {
    const cardNode = this.selectedJobCardLinkNode;
    if (cardNode === null) {
      return window.location.href;
    }
    return cardNode.href ?? '';
  }

  findRangeStart(): string {
    const salaryNode = this.salaryRangeNodes;
    if (salaryNode.length === 0) {
      return '';
    }
    const salaryFromContent = salaryNode[0].textContent ?? '';
    const salaryMatch = salaryFromContent.match(salaryRegExp);
    if (salaryMatch === null) {
      return '';
    }
    const amount = parseFloat(salaryMatch.groups!.amount);
    if (Number.isNaN(amount)) {
      return ``;
    }
    if (salaryFromContent.endsWith('K')) {
      return `=${amount * 1000}`;
    }
    return hourRateToYear(amount);
  }

  findRangeEnd(): string {
    const salaryNode = this.salaryRangeNodes;
    if (salaryNode.length <= 1) {
      return '';
    }
    const salaryFromContent = salaryNode[1].textContent ?? '';
    const salaryMatch = salaryFromContent.match(salaryRegExp);
    if (salaryMatch === null) {
      return '';
    }
    const amount = parseFloat(salaryMatch.groups!.amount);
    if (Number.isNaN(amount)) {
      return ``;
    }
    if (salaryFromContent.endsWith('K')) {
      return `=${amount * 1000}`;
    }
    return hourRateToYear(amount);
  }

  get companyWrapperNode(): HTMLElement | null {
    return document.querySelector('[class*="JobDetails_jobDetailsHeaderWrapper__"]');
  }

  get companyLinkNode(): HTMLLinkElement | null {
    const wrapper = this.companyWrapperNode;
    if (wrapper === null) {
      return null;
    }
    return wrapper.querySelector('[class*="EmployerProfile_profileContainer__"]');
  }

  get companyNameNode(): HTMLSpanElement | null {
    const wrapper = this.companyLinkNode;
    if (wrapper === null) {
      return null;
    }
    return wrapper.querySelector('[class*="EmployerProfile_employerName__"]');
  }

  get jobDescriptionNode(): HTMLHeadingElement | null {
    return document.querySelector('h1[id*="jd-job-title-"]');
  }

  get salaryRangeWrapperNode(): HTMLElement | null {
    return document.querySelector('[class*="SalaryEstimate_salaryRange"]');
  }

  get salaryRangeNodes(): HTMLElement[] {
    const wrapper = this.salaryRangeWrapperNode;
    if (wrapper === null) {
      return [];
    }
    return Array.from(wrapper.querySelectorAll('[class*="SalaryEstimate_rangeEstimate"]'));
  }

  get selectedJobCardNode(): HTMLElement | null {
    return document.querySelector('[class*="JobCard_jobCardWrapper"][class*="JobCard_selected"]');
  }

  get selectedJobCardLinkNode(): HTMLLinkElement | null {
    const wrapper = this.selectedJobCardNode;
    if (wrapper === null) {
      return null;
    }
    return wrapper.querySelector('[id*="job-title-"]');
  }
}