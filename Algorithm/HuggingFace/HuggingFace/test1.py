{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "37d1becc",
   "metadata": {},
   "outputs": [
    {
     "ename": "TypeError",
     "evalue": "TrainingArguments.__init__() got an unexpected keyword argument 'evaluation_strategy'",
     "output_type": "error",
     "traceback": [
      "\u001b[31m---------------------------------------------------------------------------\u001b[39m",
      "\u001b[31mTypeError\u001b[39m                                 Traceback (most recent call last)",
      "\u001b[36mCell\u001b[39m\u001b[36m \u001b[39m\u001b[32mIn[1]\u001b[39m\u001b[32m, line 3\u001b[39m\n\u001b[32m      1\u001b[39m \u001b[38;5;28;01mfrom\u001b[39;00m\u001b[38;5;250m \u001b[39m\u001b[34;01mtransformers\u001b[39;00m\u001b[38;5;250m \u001b[39m\u001b[38;5;28;01mimport\u001b[39;00m TrainingArguments\n\u001b[32m----> \u001b[39m\u001b[32m3\u001b[39m args = \u001b[43mTrainingArguments\u001b[49m\u001b[43m(\u001b[49m\n\u001b[32m      4\u001b[39m \u001b[43m    \u001b[49m\u001b[43moutput_dir\u001b[49m\u001b[43m=\u001b[49m\u001b[33;43m\"\u001b[39;49m\u001b[33;43m./results\u001b[39;49m\u001b[33;43m\"\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[32m      5\u001b[39m \u001b[43m    \u001b[49m\u001b[43mevaluation_strategy\u001b[49m\u001b[43m=\u001b[49m\u001b[33;43m\"\u001b[39;49m\u001b[33;43mepoch\u001b[39;49m\u001b[33;43m\"\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[32m      6\u001b[39m \u001b[43m    \u001b[49m\u001b[43mper_device_train_batch_size\u001b[49m\u001b[43m=\u001b[49m\u001b[32;43m8\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[32m      7\u001b[39m \u001b[43m    \u001b[49m\u001b[43mper_device_eval_batch_size\u001b[49m\u001b[43m=\u001b[49m\u001b[32;43m8\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[32m      8\u001b[39m \u001b[43m    \u001b[49m\u001b[43mnum_train_epochs\u001b[49m\u001b[43m=\u001b[49m\u001b[32;43m3\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[32m      9\u001b[39m \u001b[43m    \u001b[49m\u001b[43mweight_decay\u001b[49m\u001b[43m=\u001b[49m\u001b[32;43m0.01\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[32m     10\u001b[39m \u001b[43m)\u001b[49m\n\u001b[32m     12\u001b[39m \u001b[38;5;28mprint\u001b[39m(\u001b[33m\"\u001b[39m\u001b[33mOK ✅\u001b[39m\u001b[33m\"\u001b[39m)\n",
      "\u001b[31mTypeError\u001b[39m: TrainingArguments.__init__() got an unexpected keyword argument 'evaluation_strategy'"
     ]
    }
   ],
   "source": [
    "from transformers import TrainingArguments\n",
    "\n",
    "args = TrainingArguments(\n",
    "    output_dir=\"./results\",\n",
    "    evaluation_strategy=\"epoch\",\n",
    "    per_device_train_batch_size=8,\n",
    "    per_device_eval_batch_size=8,\n",
    "    num_train_epochs=3,\n",
    "    weight_decay=0.01,\n",
    ")\n",
    "\n",
    "print(\"OK ✅\")\n"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python (hugging_face_new)",
   "language": "python",
   "name": "hugging_face"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.13.2"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
