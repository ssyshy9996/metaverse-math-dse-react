const latexPreprocess = (latex: string): string => {
  // Replace \\frac with \frac
  latex = latex.replace(/\\frac/g, "\\frac");

  // Replace \\sqrt with \sqrt
  latex = latex.replace(/\\sqrt/g, "\\sqrt");

  // Replace \\left and \\right with empty strings
  latex = latex.replace(/\\left/g, "");
  latex = latex.replace(/\\right/g, "");

  return latex;
};

const latexPostprocess = (latex: string): string => {
  return latex;
};

export { latexPreprocess, latexPostprocess };