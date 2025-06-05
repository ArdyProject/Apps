"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Trash2,
  Check,
  Clock,
  Search,
  Moon,
  Sun,
  Palette,
  Download,
  FileText,
  Instagram,
  FileDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string
  createdAt: string
  completedAt?: string
}

interface AppSettings {
  theme: "light" | "dark" | "auto"
  language: "id" | "en" | "ja"
  notifications: boolean
  primaryColor: string
}

const translations = {
  id: {
    appTitle: "Daftar Tugas",
    addTask: "Tambah Tugas",
    tasks: "Tugas",
    calendar: "Kalender",
    statistics: "Statistik",
    settings: "Pengaturan",
    newTask: "Tugas Baru",
    taskTitle: "Judul Tugas",
    taskDescription: "Deskripsi Tugas",
    priority: "Prioritas",
    category: "Kategori",
    dueDate: "Tanggal Jatuh Tempo",
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    completed: "Selesai",
    pending: "Tertunda",
    high: "Tinggi",
    medium: "Sedang",
    low: "Rendah",
    work: "Kerja",
    personal: "Pribadi",
    shopping: "Belanja",
    health: "Kesehatan",
    education: "Pendidikan",
    theme: "Tema",
    language: "Bahasa",
    notifications: "Notifikasi",
    customization: "Kustomisasi",
    dataManagement: "Manajemen Data",
    exportData: "Ekspor Data",
    importData: "Impor Data",
    clearAllData: "Hapus Semua Data",
    totalTasks: "Total Tugas",
    completedTasks: "Tugas Selesai",
    completionRate: "Tingkat Penyelesaian",
    productivity: "Produktivitas",
    thisWeek: "Minggu Ini",
    thisMonth: "Bulan Ini",
    searchTasks: "Cari Tugas",
    filterBy: "Filter Berdasarkan",
    all: "Semua",
    today: "Hari Ini",
    overdue: "Terlambat",
    upcoming: "Mendatang",
    developerInfo: "Informasi Developer",
    developerName: "Ardy Hutasoit",
    contactMe: "Hubungi Saya",
    exportToPdf: "Ekspor ke PDF",
    exportToWord: "Ekspor ke Word",
    exportSuccess: "Data berhasil diekspor",
  },
  en: {
    appTitle: "Task List",
    addTask: "Add Task",
    tasks: "Tasks",
    calendar: "Calendar",
    statistics: "Statistics",
    settings: "Settings",
    newTask: "New Task",
    taskTitle: "Task Title",
    taskDescription: "Task Description",
    priority: "Priority",
    category: "Category",
    dueDate: "Due Date",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    completed: "Completed",
    pending: "Pending",
    high: "High",
    medium: "Medium",
    low: "Low",
    work: "Work",
    personal: "Personal",
    shopping: "Shopping",
    health: "Health",
    education: "Education",
    theme: "Theme",
    language: "Language",
    notifications: "Notifications",
    customization: "Customization",
    dataManagement: "Data Management",
    exportData: "Export Data",
    importData: "Import Data",
    clearAllData: "Clear All Data",
    totalTasks: "Total Tasks",
    completedTasks: "Completed Tasks",
    completionRate: "Completion Rate",
    productivity: "Productivity",
    thisWeek: "This Week",
    thisMonth: "This Month",
    searchTasks: "Search Tasks",
    filterBy: "Filter By",
    all: "All",
    today: "Today",
    overdue: "Overdue",
    upcoming: "Upcoming",
    developerInfo: "Developer Information",
    developerName: "Ardy Hutasoit",
    contactMe: "Contact Me",
    exportToPdf: "Export to PDF",
    exportToWord: "Export to Word",
    exportSuccess: "Data exported successfully",
  },
  ja: {
    appTitle: "タスクリスト",
    addTask: "タスク追加",
    tasks: "タスク",
    calendar: "カレンダー",
    statistics: "統計",
    settings: "設定",
    newTask: "新しいタスク",
    taskTitle: "タスクタイトル",
    taskDescription: "タスクの説明",
    priority: "優先度",
    category: "カテゴリ",
    dueDate: "期限",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    completed: "完了",
    pending: "保留中",
    high: "高",
    medium: "中",
    low: "低",
    work: "仕事",
    personal: "個人",
    shopping: "買い物",
    health: "健康",
    education: "教育",
    theme: "テーマ",
    language: "言語",
    notifications: "通知",
    customization: "カスタマイズ",
    dataManagement: "データ管理",
    exportData: "データエクスポート",
    importData: "データインポート",
    clearAllData: "全データ削除",
    totalTasks: "総タスク数",
    completedTasks: "完了タスク",
    completionRate: "完了率",
    productivity: "生産性",
    thisWeek: "今週",
    thisMonth: "今月",
    searchTasks: "タスク検索",
    filterBy: "フィルター",
    all: "すべて",
    today: "今日",
    overdue: "期限切れ",
    upcoming: "予定",
    developerInfo: "開発者情報",
    developerName: "Ardy Hutasoit",
    contactMe: "お問い合わせ",
    exportToPdf: "PDFにエクスポート",
    exportToWord: "Wordにエクスポート",
    exportSuccess: "データのエクスポートに成功しました",
  },
}

const colorThemes = {
  blue: "hsl(221, 83%, 53%)",
  green: "hsl(142, 76%, 36%)",
  purple: "hsl(262, 83%, 58%)",
  orange: "hsl(25, 95%, 53%)",
  pink: "hsl(330, 81%, 60%)",
  red: "hsl(0, 84%, 60%)",
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<AppSettings>({
    theme: "light",
    language: "id",
    notifications: true,
    primaryColor: "blue",
  })
  const [activeTab, setActiveTab] = useState("tasks")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    category: "personal",
    dueDate: "",
  })

  const { toast } = useToast()
  const t = translations[settings.language]

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("todoTasks")
    const savedSettings = localStorage.getItem("todoSettings")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save to localStorage whenever tasks or settings change
  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("todoSettings", JSON.stringify(settings))
    document.documentElement.style.setProperty(
      "--primary-color",
      colorThemes[settings.primaryColor as keyof typeof colorThemes],
    )

    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings])

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [task, ...prev])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "personal",
      dueDate: "",
    })
    setIsAddTaskOpen(false)

    if (settings.notifications) {
      toast({
        title: "✅ Tugas berhasil ditambahkan!",
        description: newTask.title,
      })
    }
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    toast({
      title: "🗑️ Tugas dihapus",
      description: "Tugas berhasil dihapus dari daftar",
    })
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    const today = new Date()
    const taskDate = new Date(task.dueDate)

    switch (filterBy) {
      case "completed":
        return task.completed
      case "pending":
        return !task.completed
      case "today":
        return taskDate.toDateString() === today.toDateString()
      case "overdue":
        return !task.completed && taskDate < today
      case "upcoming":
        return !task.completed && taskDate > today
      default:
        return true
    }
  })

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    const thisWeek = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return taskDate >= weekAgo
    }).length

    return { total, completed, completionRate, thisWeek }
  }

  const exportData = () => {
    const data = { tasks, settings }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "todo-backup.json"
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "📤 Data berhasil diekspor",
      description: "File backup telah diunduh",
    })
  }

  const clearAllData = () => {
    setTasks([])
    localStorage.removeItem("todoTasks")
    toast({
      title: "🧹 Semua data dihapus",
      description: "Semua tugas telah dihapus",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const stats = getTaskStats()

  const exportToPdf = () => {
    try {
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(20)
      doc.text("Todo List Report", 105, 15, { align: "center" })

      // Add date
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" })

      // Add developer info
      doc.setFontSize(10)
      doc.text(`Developer: Ardy Hutasoit`, 105, 27, { align: "center" })

      // Add stats
      doc.setFontSize(14)
      doc.text("Statistics", 14, 40)

      doc.setFontSize(10)
      doc.text(`Total Tasks: ${stats.total}`, 14, 50)
      doc.text(`Completed Tasks: ${stats.completed}`, 14, 55)
      doc.text(`Completion Rate: ${stats.completionRate}%`, 14, 60)

      // Add tasks table
      const tableColumn = ["Title", "Priority", "Category", "Due Date", "Status"]
      const tableRows = tasks.map((task) => [
        task.title,
        task.priority,
        task.category,
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-",
        task.completed ? "Completed" : "Pending",
      ])

      doc.setFontSize(14)
      doc.text("Tasks", 14, 75)

      // @ts-ignore
      doc.autoTable({
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [66, 135, 245] },
      })

      // Save the PDF
      doc.save("todo-list-report.pdf")

      toast({
        title: "📄 " + t.exportSuccess,
        description: "PDF file has been downloaded",
      })
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      toast({
        title: "❌ Error",
        description: "Failed to export to PDF",
        variant: "destructive",
      })
    }
  }

  const exportToWord = () => {
    try {
      // Create HTML content for Word document
      let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
          <meta charset="utf-8">
          <title>Todo List Report</title>
          <style>
            table {border-collapse: collapse; width: 100%;}
            th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
            th {background-color: #4287f5; color: white;}
            tr:nth-child(even) {background-color: #f2f2f2;}
            h1, h2 {color: #333;}
            .developer {color: #666; font-style: italic;}
          </style>
        </head>
        <body>
          <h1>Todo List Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p class="developer">Developer: Ardy Hutasoit</p>
          
          <h2>Statistics</h2>
          <p>Total Tasks: ${stats.total}</p>
          <p>Completed Tasks: ${stats.completed}</p>
          <p>Completion Rate: ${stats.completionRate}%</p>
          
          <h2>Tasks</h2>
          <table>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
      `

      tasks.forEach((task) => {
        htmlContent += `
          <tr>
            <td>${task.title}</td>
            <td>${task.priority}</td>
            <td>${task.category}</td>
            <td>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
            <td>${task.completed ? "Completed" : "Pending"}</td>
          </tr>
        `
      })

      htmlContent += `
          </table>
        </body>
        </html>
      `

      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: "application/msword" })
      const url = URL.createObjectURL(blob)

      // Create a link and trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = "todo-list-report.doc"
      a.click()

      // Clean up
      URL.revokeObjectURL(url)

      toast({
        title: "📄 " + t.exportSuccess,
        description: "Word document has been downloaded",
      })
    } catch (error) {
      console.error("Error exporting to Word:", error)
      toast({
        title: "❌ Error",
        description: "Failed to export to Word",
        variant: "destructive",
      })
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${settings.theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{t.appTitle}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setSettings((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }))}
              >
                {settings.theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Bell className="h-5 w-5" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs opacity-80">{t.totalTasks}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-xs opacity-80">{t.completed}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <div className="text-xs opacity-80">{t.completionRate}</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t.searchTasks}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="completed">{t.completed}</SelectItem>
                <SelectItem value="today">{t.today}</SelectItem>
                <SelectItem value="overdue">{t.overdue}</SelectItem>
                <SelectItem value="upcoming">{t.upcoming}</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addTask}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-auto">
                <DialogHeader>
                  <DialogTitle>{t.newTask}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>{t.taskTitle}</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder={t.taskTitle}
                    />
                  </div>
                  <div>
                    <Label>{t.taskDescription}</Label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder={t.taskDescription}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>{t.priority}</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: any) => setNewTask((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t.low}</SelectItem>
                          <SelectItem value="medium">{t.medium}</SelectItem>
                          <SelectItem value="high">{t.high}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t.category}</Label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">{t.work}</SelectItem>
                          <SelectItem value="personal">{t.personal}</SelectItem>
                          <SelectItem value="shopping">{t.shopping}</SelectItem>
                          <SelectItem value="health">{t.health}</SelectItem>
                          <SelectItem value="education">{t.education}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>{t.dueDate}</Label>
                    <Input
                      type="datetime-local"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTask} className="flex-1">
                      {t.save}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddTaskOpen(false)} className="flex-1">
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4 mx-4">
            <TabsTrigger value="tasks" className="text-xs">
              <Check className="h-4 w-4 mr-1" />
              {t.tasks}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs">
              <Calendar className="h-4 w-4 mr-1" />
              {t.calendar}
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              <BarChart3 className="h-4 w-4 mr-1" />
              {t.statistics}
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="h-4 w-4 mr-1" />
              {t.settings}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="p-4 space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada tugas yang ditemukan</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className={`transition-all duration-200 ${task.completed ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Button variant="ghost" size="icon" className="mt-1" onClick={() => toggleTask(task.id)}>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            task.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                          }`}
                        >
                          {task.completed && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                            {task.title}
                          </h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="secondary" className="text-xs">
                            {task.category}
                          </Badge>
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString("id-ID")}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="calendar" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t.calendar}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.dueDate && !task.completed)
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 5)
                    .map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <div className="flex-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(task.dueDate).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t.productivity}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t.completionRate}</span>
                    <span>{stats.completionRate}%</span>
                  </div>
                  <Progress value={stats.completionRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.thisWeek}</div>
                    <div className="text-sm text-gray-600">{t.thisWeek}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-gray-600">{t.completed}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Kategori Tugas</h4>
                  {["work", "personal", "shopping", "health", "education"].map((category) => {
                    const categoryTasks = tasks.filter((t) => t.category === category)
                    const completed = categoryTasks.filter((t) => t.completed).length
                    const percentage = categoryTasks.length > 0 ? (completed / categoryTasks.length) * 100 : 0

                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {t.customization}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t.theme}</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: any) => setSettings((prev) => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t.language}</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value: any) => setSettings((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t.notifications}</Label>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Warna Tema</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.entries(colorThemes).map(([name, color]) => (
                      <button
                        key={name}
                        className={`w-8 h-8 rounded-full border-2 ${
                          settings.primaryColor === name ? "border-gray-800 dark:border-white" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSettings((prev) => ({ ...prev, primaryColor: name }))}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {t.dataManagement}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={exportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t.exportData}
                </Button>

                <Button onClick={exportToPdf} variant="outline" className="w-full">
                  <FileDown className="h-4 w-4 mr-2" />
                  {t.exportToPdf}
                </Button>

                <Button onClick={exportToWord} variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  {t.exportToWord}
                </Button>

                <Button onClick={clearAllData} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.clearAllData}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.developerInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-bold">{t.developerName}</h3>
                  <div className="flex justify-center gap-4 mt-3">
                    <a
                      href="https://wa.me/6283146557755"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-600 hover:text-green-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href="https://www.instagram.com/namae_wa_ardy?igsh=YXo1aDI5czBzN3c="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="h-5 w-5" />
                      Instagram
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
