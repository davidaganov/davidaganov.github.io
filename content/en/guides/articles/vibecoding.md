---
title: Mindful Vibe Coding
description: An article about how I use AI in my work and why I don't consider it a replacement for developers.
icon: i-lucide-file-text
habrUrl: https://habr.com/ru/articles/982452/
publishedAt: 2026-01-02
readingTime: 6 min
languageOriginal: "ru"
tags:
  - Artificial Intelligence
  - Development
---

# Mindful Vibe Coding

> This is not a guide, but just another article about AI. Below is my personal experience and perspective on how AI is currently being integrated into development. No attempt to convince anyone, but a description of what works for me and what doesn't.

Enough has already been said and written about vibe coding.

Some believe that code written with the help of AI is inherently unmaintainable, scales poorly, and takes longer to debug than writing everything from scratch.  
Others, on the contrary, say that such code is great for small startups, freelancing, or even that the concept of "clean code" is dead — the main thing is that it works.

In my opinion, both are only partially right. There are many extremes surrounding the discussion of this topic. AI is just a tool that, in the right hands, can greatly simplify life. At the same time, I don't believe that a specialist has already appeared on the market who works with AI as effectively as possible; we are all still just learning how to apply it.

## What I Use

### Models

**Claude Sonnet 4.5** — currently the best model for coding for my tasks. It most often gives a predictable result. I tried replacing it, but I haven't found a full-fledged alternative for myself yet.  
**GPT 5.2** — I use it mainly for communication and design: discussing ideas, sketching out work plans, choosing a stack, breaking down options by pros and cons, and structuring thoughts.

### Software

**Cursor** — has been my primary editor for about a year. The main advantage, in my opinion, is the **Plan** mode: it asks clarifying questions and outputs an MD file with a description of the task and a list of what needs to be done. Then Cursor works with the code, focusing specifically on this file.  
**Windsurf** — I started using it when I ran out of tokens in my Cursor subscription. The free version has GPT 5.2, which is quite enough for tasks that aren't too complex. It's well-suited for design, prototypes, and quick experiments (and you can also generate as many new accounts as you want using 10-minute mail).

### Pet Projects

Since my school days, I've had many ideas for software, websites, and services. But almost always, everything hit a wall due to either a lack of skill or the time it would take to implement. Now, AI covers many of these problems and acts as a crutch that allows me to move forward.

This is what my first steps in creating a new project look like now:

1.  An idea appears. For example, a service for tracking finances. I discuss it with ChatGPT: in what form it's better to implement it, on what technologies, how it can be hosted, and what the final result should be. I ask it to ask 10–15 questions, the answers to which will help in building a plan.
2.  After that, I ask it to build a plan taking into account my answers and the context of the dialogue. I get an MD file, review it carefully, gather my questions, clarify some things, and make edits. When the file becomes clear and logical, I consider it ready for work.
3.  I put this file in an empty project folder, pass it as context into the chat, and ask to build the architecture and install dependencies. In parallel, I manually set up my configs for eslint, prettier, editorconfig, and fix the small things that are important and familiar to me.

At first glance, it might seem that these are extra steps and it would be easier to just start writing code. But through this process, I cover my need for a technical specification and get rid of the necessity to redo the same thing several times during development.

In essence, I start working as if I've already been given a project with a clear technical specification, architecture, requirements, and a general understanding of the final result. At the same time, the horizon of work is immediately visible, which is often missing when working on pet projects. I break the resulting plan into tasks or sprints and then just get to implementation. This is exactly why I stopped abandoning pet projects halfway and started finishing them more often.

Plus, in this case, the neural network receives not 3-4 abstract sentences as input, but a quite clear and structured task description, which it works with noticeably better.

## Work Tasks

I don't think it's even worth writing about the fact that tasks need to be broken down into small pieces. But at the same time, I often notice other problems when people try to integrate AI into their workflow.

Most often, a negative experience is related to the fact that the agent is not given the necessary context. They don't attach specific files that need to be worked on, don't specify constraints, and don't explain what already exists in the project. For example, that existing functions, helpers, or composables need to be reused.

It is important to understand a simple thing: a neural network **does not keep the entire project in its head**. You shouldn't rely on it going and running through the repository itself, finding the right function in some `utils` folder, and neatly importing it. In reality, this almost never happens.

If you are doing a task related to working with time — attach a helper where there are already functions for this.  
If you don't know exactly where the necessary item is in the project — tell it directly to go through the code and look for files related to the task.  
If you want to work on a specific module — throw the whole folder into the context and ask it to study it carefully.

To summarize: imagine the entire area of knowledge you need to solve the task and **explicitly pass it to the agent**. This could be files, folders, an instruction to find the necessary information inside the project or on the internet. The latter is especially relevant for fresh libraries; in such cases, it's better to immediately ask to Google the documentation rather than relying on the model's knowledge (with the same Google Maps, all models suggested deprecated methods until I asked to find the documentation, and sometimes I even just dropped links to specific sections directly into the chat).

Also, I almost always ask for such trivial things as:

- using best practices
- asking me questions **before** writing code
- clarifying points related to scalability
- thinking about reusability of solutions

_I understand that it sounds obvious, but many neglect these simple steps and get a significantly worse result that requires more manual work later._

My workflow usually looks like this:

1.  I take the task text or formulate it myself. I attach as many files and examples as possible, and say in advance which new files need to be created and where they should be located. At the end, I ask to ask additional questions and clarify the goal of the work.
2.  I answer the questions, read the neural network's feedback, evaluate how much it is "in context," and only after that give the command to proceed.
3.  The first iteration almost always looks like a roughly hewn piece of stone. Then I go through the code line by line: I fix the style, align approaches, and remove rough edges. At this stage, it's important not to make major overhauls; the goal is to get a working solution.
4.  After I've fixed everything, brought it to a common style, and eliminated errors, I open a new chat. I pass all the edited files there, describe the context of the work done, and ask to evaluate the solution. Often at this stage, the neural network finds duplicate code, questionable spots, potential bugs, or typing issues. This allows for additional feedback even before the review.

The goal of this approach is to shift the focus from solving the task manually to managing the process. Fewer mechanical actions and more control over the result.

At first, this may seem longer than writing the code yourself. But over time, you start to navigate faster and significantly increase productivity. The approach is quite flexible and depends on the volume of work: in some places, there's no need for extra double-checking; in others, problems are visible immediately and resolved manually.

But the overall pipeline closes the pain of long mechanical code entry in situations where the solution is already in your head. In such cases, it is often more profitable to review the finished version, fit it to your vision, or even look up an idea that you haven't yet reached yourself.

## Boundaries of Vibe Coding

Separately, I want to say something about the generation of entire sites and applications without any human control. Various services in the spirit of "make me a site or app based on a description" look impressive, but in practice, I consider such an approach non-viable.

In the first stages, everything can indeed look normal. You can even take screenshots of the app and post them on the internet to show up those who don't believe in inevitable progress and the imminent downsizing of the entire IT industry. But problems almost always start exactly at the moment when edits are required, a bug needs to be figured out, or a new feature needs to be added. Without understanding the architecture and what is happening in the code, you very quickly lose control over the system.

For the same reason, I consider vibe coding without a solid technical foundation to be a dead end. If you don't understand exactly what the generated code is doing, you cannot assess its quality, make an architectural decision, or notice a problem in time.

At the same time, I don't consider such tools useless. Perhaps, thanks to them, the very concept of an MVP will disappear in the near future, and clients will come with results already generated by AI. Or designers will start demonstrating layouts and product ideas in this format. But as soon as it comes to a live project, maintenance, scaling, and responsibility for the result, everything starts to fall apart without control and understanding of the process.

---

## Conclusion

For me, vibe coding is not an attempt to shift responsibility to the neural network or a way to "write code without thinking." It is a tool that helps to quickly go from an idea to a result if you understand exactly what you are doing and why.

Where there is control, context, and understanding of the process, AI really saves time and effort. Where it is missing, it creates only an illusion of speed. And in this sense, vibe coding is not about abandoning engineering thinking, but about strengthening it. I hope that the doubters will try it and understand that AI can make their life a little easier, and solving routine tasks will take a backseat, giving the opportunity to grow professionally a little bit faster.
