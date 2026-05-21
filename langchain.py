import warnings
warnings.filterwarnings("ignore")


from langchain_community.chat_models import ChatOllama


llm = ChatOllama(model="llama3")


from crewai import LLM

llm = LLM(
    model="ollama/llama3",
    base_url="http://localhost:11434"
)


from crewai import Agent

planner = Agent(
    role="Planner",
    goal="Plan content on {topic}",
    backstory="You are a planner",
    llm=llm,
    verbose=True
)



writer = Agent(
    role="Content Writer",
    goal="Write blog post on {topic}",
    backstory="You are a writer",
    llm=llm,   # ⭐ SAME HERE
    verbose=True
)


editor = Agent(
    role="Editor",
    goal="Edit content",
    backstory="You are an editor",
    llm=llm,   # ⭐ SAME HERE
    verbose=True
)


from crewai import Task, Crew

plan = Task(
    description="Plan content on {topic}",
    expected_output="Outline",
    agent=planner
)

write = Task(
    description="Write article using plan",
    expected_output="Blog post",
    agent=writer
)

edit = Task(
    description="Edit the blog post",
    expected_output="Final blog post",
    agent=editor
)



crew = Crew(
    agents=[planner, writer, editor],
    tasks=[plan, write, edit],
    verbose=True
)


result = crew.kickoff(inputs={"topic": "Ethiopian transport"})
print(result)