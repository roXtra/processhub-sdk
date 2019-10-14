export interface ILibraryTag {
  // Changes must also be reflected in gqlTypes and gqlFragments below!
  tagName: string;
  tagRelevance: number;  // Increased every time a user clicks on a tag
}
export const gqlLibraryTypes = `     
  type LibraryTag {
    tagName: String!
    tagRelevance: Int
  }
`;
