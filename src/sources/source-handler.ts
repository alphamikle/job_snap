export interface SourceHandler {
  get code(): string;

  findCompanyName() : string;

  findCompanyLink() : string;

  findJobTitle() : string;

  findJobLink() : string;

  findRangeStart() : string;

  findRangeEnd() : string;
}