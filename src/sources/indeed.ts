import { SourceHandler } from './source-handler';
import { clearUrl, hourRateToYear } from '../utils/tools';

const salaryToRegExp = /Up to \$(?<to>\d+[,.]?\d+)/;
const salaryRangeRegExp = /\$(?<from>\d+[,.]?\d+) - \$(?<to>\d+[,.]?\d+)/;
const salaryFromRegExp = /From \$(?<from>\d+[,.]?\d+)/;

type SalaryInfo = [number | null, number | null];

export class IndeedSourceHandler implements SourceHandler {
  get code(): string {
    return 'indeed';
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
    return clearUrl(node.href);
  }

  findJobTitle(): string {
    const node = this.jobNode;
    if (node === null) {
      return '';
    }
    return node.textContent ?? '';
  }

  findJobLink(): string {
    if (this.isJobPage) {
      return window.location.href;
    }

    const url = new URL(window.location.href);
    // https://www.indeed.com/jobs?q=Flutter&l=United+States&from=searchOnHP&vjk=becb8a06518916c4
    const jobLink = url.searchParams.get('vjk');
    return `https://www.indeed.com/viewjob?jk=${jobLink}`;
  }

  findRangeStart(): string {
    const node = this.salaryNode;
    if (node === null) {
      return '';
    }
    const salaryContent = node.textContent ?? '';
    const salaryInfo = this.parseSalaryInfo(salaryContent);

    if (salaryInfo[0] === null) {
      return '';
    }
    if (salaryContent.includes('year')) {
      return `=${salaryInfo[0]}`;
    }
    return hourRateToYear(salaryInfo[0]);
  }

  findRangeEnd(): string {
    const node = this.salaryNode;
    if (node === null) {
      return '';
    }
    const salaryContent = node.textContent ?? '';
    const salaryInfo = this.parseSalaryInfo(salaryContent);

    if (salaryInfo[1] === null) {
      return '';
    }
    if (salaryContent.includes('year')) {
      return `=${salaryInfo[1]}`;
    }
    return hourRateToYear(salaryInfo[1]);
  }

  private get companyNode(): HTMLLinkElement | null {
    return document.querySelector('.jobsearch-CompanyInfoWithoutHeaderImage a');
  }

  private get salaryNode(): HTMLSpanElement | null {
    return document.querySelector('#salaryInfoAndJobType span');
  }

  private parseSalaryInfo(content: string): SalaryInfo {
    let match = content.match(salaryRangeRegExp);
    if (match === null) {
      match = content.match(salaryFromRegExp);
    }
    if (match === null) {
      match = content.match(salaryToRegExp);
    }
    if (match === null) {
      return [null, null];
    }
    const rangeStart = match.groups?.from ?? '';
    const rangeEnd = match.groups?.to ?? '';

    const start = parseFloat(rangeStart.replace(',', ''));
    const end = parseFloat(rangeEnd.replace(',', ''));

    if (Number.isNaN(start) && Number.isNaN(end)) {
      return [null, null];
    } else if (Number.isNaN(start)) {
      return [null, end];
    } else if (Number.isNaN(end)) {
      return [start, null];
    }

    return [start, end];
  }

  private get jobNode(): HTMLSpanElement | null {
    return document.querySelector('.jobsearch-JobInfoHeader-title span');
  }

  private get isJobPage(): boolean {
    return window.location.href.includes('viewjob');
  }

}