import { useState } from "react";
import { Search, Plus, Trash2, Edit, Server, Cpu, HardDrive, Database, Zap, Network } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hardware categories with their fields
const hardwareCategories = {
  CPU: {
    icon: Cpu,
    color: "from-blue-500 to-cyan-500",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂", label: "厂商" },
      { key: "架构", label: "架构" },
      { key: "内核数", label: "内核数" },
      { key: "线程数", label: "线程数" },
      { key: "睿频(GHz)", label: "睿频(GHz)" },
      { key: "基频(GHz)", label: "基频(GHz)" },
      { key: "内存类型", label: "内存类型" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  Memory: {
    icon: Database,
    color: "from-emerald-500 to-teal-500",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "容量(GB)", label: "容量(GB)" },
      { key: "Speed(Mbps)", label: "Speed(Mbps)" },
      { key: "ddr", label: "DDR类型" },
      { key: "DIMM类型", label: "DIMM类型" },
      { key: "Rank", label: "Rank" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  NIC: {
    icon: Network,
    color: "from-violet-500 to-purple-500",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "link类型", label: "Link类型" },
      { key: "link宽度", label: "Link宽度" },
      { key: "介质类型", label: "介质类型" },
      { key: "模块类型", label: "模块类型" },
      { key: "电口数量", label: "电口数量" },
      { key: "光口数量", label: "光口数量" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  Storage: {
    icon: HardDrive,
    color: "from-orange-500 to-amber-500",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "容量", label: "容量" },
      { key: "盘体尺寸", label: "盘体尺寸" },
      { key: "物理接口", label: "物理接口" },
      { key: "接口速度(Gb/s)", label: "接口速度(Gb/s)" },
      { key: "顺序读(MB/s)", label: "顺序读(MB/s)" },
      { key: "顺序写(MB/s)", label: "顺序写(MB/s)" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  GPU: {
    icon: Zap,
    color: "from-rose-500 to-pink-500",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "显存容量", label: "显存容量" },
      { key: "显存类型", label: "显存类型" },
      { key: "link类型", label: "Link类型" },
      { key: "link宽度", label: "Link宽度" },
      { key: "是否带桥接接口", label: "是否带桥接接口" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  RAID: {
    icon: Server,
    color: "from-cyan-500 to-blue-500",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "raid卡类型", label: "RAID卡类型" },
      { key: "支持raid类型", label: "支持RAID类型" },
      { key: "接口类型", label: "接口类型" },
      { key: "接口数量", label: "接口数量" },
      { key: "内置盘口", label: "内置盘口" },
      { key: "缓存容量", label: "缓存容量" },
    ],
  },
};

type Requirement = {
  id: string;
  category: string;
  field: string;
  operator: string;
  value: string;
};

const HardwareRequirements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof hardwareCategories>("CPU");
  const [selectedField, setSelectedField] = useState("");
  const [operator, setOperator] = useState(">=");
  const [value, setValue] = useState("");
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  // Mock customer data
  const customers = [
    "阿里云",
    "腾讯云",
    "华为云",
    "百度云",
    "字节跳动",
    "京东云",
  ];

  const filteredCustomers = customers.filter((customer) =>
    customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRequirement = () => {
    if (!selectedCustomer || !selectedField || !value) return;

    const newRequirement: Requirement = {
      id: Date.now().toString(),
      category: selectedCategory,
      field: selectedField,
      operator,
      value,
    };

    setRequirements([...requirements, newRequirement]);
    setSelectedField("");
    setValue("");
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements(requirements.filter((req) => req.id !== id));
  };

  const CategoryIcon = hardwareCategories[selectedCategory].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            硬件性能指标管理
          </h1>
          <p className="text-muted-foreground">IDC项目交付服务器硬件性能最低要求配置</p>
        </div>

        {/* Customer Selection */}
        <Card className="mb-6 shadow-[var(--shadow-medium)] border-0 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              客户选择
            </CardTitle>
            <CardDescription>搜索并选择需要配置的客户</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="输入客户名称进行搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredCustomers.map((customer) => (
                <Button
                  key={customer}
                  variant={selectedCustomer === customer ? "default" : "outline"}
                  onClick={() => setSelectedCustomer(customer)}
                  className="justify-start"
                >
                  {customer}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedCustomer && (
          <>
            {/* Hardware Category Selection */}
            <Card className="mb-6 shadow-[var(--shadow-medium)] border-0">
              <CardHeader>
                <CardTitle>硬件类型选择</CardTitle>
                <CardDescription>为 {selectedCustomer} 配置硬件性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as keyof typeof hardwareCategories)}>
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    {Object.entries(hardwareCategories).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <TabsTrigger key={key} value={key} className="gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{key}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {Object.keys(hardwareCategories).map((key) => (
                    <TabsContent key={key} value={key} className="mt-6">
                      <Card className={`border-2 bg-gradient-to-br ${hardwareCategories[key as keyof typeof hardwareCategories].color} bg-opacity-5`}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CategoryIcon className="h-5 w-5" />
                            添加 {key} 性能指标
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>字段</Label>
                              <Select value={selectedField} onValueChange={setSelectedField}>
                                <SelectTrigger>
                                  <SelectValue placeholder="选择字段" />
                                </SelectTrigger>
                                <SelectContent>
                                  {hardwareCategories[key as keyof typeof hardwareCategories].fields.map((field) => (
                                    <SelectItem key={field.key} value={field.key}>
                                      {field.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>条件</Label>
                              <Select value={operator} onValueChange={setOperator}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value=">=">&gt;=</SelectItem>
                                  <SelectItem value="<=">&lt;=</SelectItem>
                                  <SelectItem value="=">=</SelectItem>
                                  <SelectItem value=">>">&gt;</SelectItem>
                                  <SelectItem value="<">&lt;</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>数值</Label>
                              <Input
                                placeholder="输入数值"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="invisible">操作</Label>
                              <Button onClick={handleAddRequirement} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                添加
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Requirements List */}
            {requirements.length > 0 && (
              <Card className="shadow-[var(--shadow-medium)] border-0">
                <CardHeader>
                  <CardTitle>已配置的性能指标</CardTitle>
                  <CardDescription>
                    客户: {selectedCustomer} | 共 {requirements.length} 条配置
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {requirements.map((req) => {
                      const CategoryIcon = hardwareCategories[req.category as keyof typeof hardwareCategories].icon;
                      const colorClass = hardwareCategories[req.category as keyof typeof hardwareCategories].color;
                      
                      return (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-[var(--shadow-soft)] transition-shadow"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass}`}>
                              <CategoryIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-1">
                                {req.category}
                              </Badge>
                              <p className="text-sm font-medium">
                                {req.field} {req.operator} {req.value}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRequirement(req.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HardwareRequirements;
