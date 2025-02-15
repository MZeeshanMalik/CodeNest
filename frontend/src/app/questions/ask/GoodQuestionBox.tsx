const GoodQuestionBox = () => {
  return (
    <div className="bg-pink-50 border border-pink-200 p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Writing a good question
      </h2>
      <p className="text-gray-700 mb-4">
        You’re ready to{" "}
        <a href="#" className="text-red-600 hover:underline">
          ask a programming-related question
        </a>{" "}
        and this form will help guide you through the process.
      </p>

      <h3 className="text-lg font-medium text-gray-800 mb-2">Steps</h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Summarize your problem in a one-line title.</li>
        <li>Describe your problem in more detail.</li>
        <li>Describe what you tried and what you expected to happen.</li>
        <li>
          Add <span className="italic">tags</span> which help surface your
          question to members of the community.
        </li>
        <li>Review your question and post it to the site.</li>
      </ul>
    </div>
  );
};

export default GoodQuestionBox;
