// MofetContext.tsx
import React, { ReactNode, useState, useMemo, createContext, useContext } from 'react';
import { CommonObject, AbuseType, initialAbuseType } from '..';

type Context = {
    questions: CommonObject[], 
    setQuestionsData: (data: CommonObject[]) => void, 
    setUpdateQuestionItem: (item: CommonObject, isRemove: boolean) => void,  
    selQuestionId: number, 
    setSelQuestionId: (id: number) => void, 
    selAbuse: AbuseType, 
    setSelAbuseData: (data: AbuseType) => void, 
    selWall: string, 
    setSelWallText: (val: string) => void, 
    showQuestionModal: boolean, 
    setShowQuestionModalVisible: (val: boolean) => void,
    openQuestion: number, 
    setOpenQuestionId: (val: number) => void, 
    isFetching: boolean, 
    setIsFetchingFlag: (val: boolean) => void, 
};

const QuestionContext = createContext<Context | null>(null);

export function QuestionProvider({ children }: { children: ReactNode }) {

    const [ questions, setQuestions ] = useState<CommonObject[]>([]);
    const [ selQuestionId, setSelQuestionId ] = useState<number>(0);
    const [ selAbuse, setSelAbuse ] = useState<AbuseType>(initialAbuseType);
    const [ selWall, setSelWall ] = useState<string>("");
    const [ showQuestionModal, setShowQuestionModal ] = useState<boolean>(false);
    const [ openQuestion, setOpenQuestion ] = useState<number>(0);
    const [ isFetching, setIsFetching ] = useState<boolean>(false);

    const setQuestionsData = (data: CommonObject[] ) => {
        setQuestions(data);
    }

    const setSelAbuseData = ( data: AbuseType) => {
        setSelAbuse(data);
    }

    const setUpdateQuestionItem = ( answer: CommonObject, isRemove: boolean) => {
        const index = questions.findIndex((item: CommonObject) => item.id === answer.id);
        const newQuestions = [...questions];

        if(isRemove) {
            newQuestions.splice(index, 1);
        } else {
            newQuestions.splice(index, 1, answer);
        }
        setQuestions(newQuestions);
    }

    const setSelWallText = (val: string ) => {
        if( isFetching ) return;
        setOpenQuestion(0);
        setSelWall(val);
    }

    const setShowQuestionModalVisible = (val: boolean) => {
        setShowQuestionModal(val);
    }

    const setOpenQuestionId = (val: number) => {
        setOpenQuestion(val);
    }

    const setIsFetchingFlag = (val: boolean) => {
        setIsFetching(val);
    }

    const values = useMemo(
        () => ({
            questions,
            selQuestionId, 
            selAbuse, 
            selWall, 
            showQuestionModal, 
            openQuestion, 
            isFetching, 
            setQuestionsData, 
            setUpdateQuestionItem, 
            setSelQuestionId, 
            setSelAbuseData, 
            setSelWallText, 
            setShowQuestionModalVisible, 
            setOpenQuestionId, 
            setIsFetchingFlag, 
        }),
        [ 
            questions, 
            selQuestionId, 
            selAbuse, 
            selWall, 
            showQuestionModal, 
            openQuestion, 
            isFetching, 
            setQuestionsData, 
            setUpdateQuestionItem, 
            setSelQuestionId, 
            setSelAbuseData, 
            setSelWallText, 
            setShowQuestionModalVisible, 
            setOpenQuestionId, 
            setIsFetchingFlag, 
        ]
    );

    return <QuestionContext.Provider value={values}>{children}</QuestionContext.Provider>;
}


export function useQuestion(): Context {
  const context = useContext(QuestionContext);

  if (context === null) {
    throw new Error('questionsData must be used within an QuestionProvider');
  }

  return context;
}